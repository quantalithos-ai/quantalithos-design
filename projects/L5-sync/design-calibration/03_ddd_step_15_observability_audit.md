# Step 15. 可观测性与审计埋点契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 15；回填正式 `03-详细设计.md` §14。
>
> 本步采用 `projects/L1-governance` Step 15 的“runtime signal 与 persisted audit 分离、低基数、redaction-first”粒度，并按 L5-sync 的 local working-copy、Git/filesystem effect、unknown/recovery 与 provenance 主线裁剪。L5-sync 不拥有平台 Audit、Evidence、Report、Verdict 或 Readiness truth。

## 1. Step 状态与分批计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15：可观测性与审计埋点契约 |
| 当前状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 回填位置 | 正式 `03-详细设计.md` §14；并回填 Step 4/7 的 technical instrumentation seam |
| 本步禁止 | 不选择日志/metrics/trace产品，不定采样/保留/告警阈值/SLO，不生成或声称存在artifact/report/evidence/verdict/signoff/readiness |

### 1.1 分批计划

| 批次 | 内容 | 状态 | 停审结论 |
|---|---|---|---|
| 15.1 | 输入、SOP回答、诊断、原则 | completed | runtime signals与local durable traceability分层 |
| 15.2 | structured log字段与位置 | completed | allowlist + event-specific fields；无raw body/secret/path/output |
| 15.3 | low-cardinality metrics | completed | IDs/refs/key/digest/path/version禁止作label |
| 15.4 | trace/span与diagnostics port | completed | technical span不证明business success；sink failure隔离 |
| 15.5 | local audit/provenance材料、redaction矩阵、前序审计 | completed | 不新建audit truth/outbox；Step 16切口明确 |

## 2. 本步输入

| 输入 | 本步采用内容 |
|---|---|
| 正式 00/01/02 | bounded/redacted correlation、provenance追溯、telemetry不改变结果、diagnostics不证明Review/evidence/readiness。 |
| Step 6 | 17 lifecycle objects、`ProvenanceRecord`、proof/transition/result/invocation carriers、safe views与redaction marker。 |
| Step 7 | `DiagnosticsPort`、`SyncDiagnosticReadPort`、repositories、UoW、external/tool ports与adapter error boundary。 |
| Step 8 | 10 Command、13 Query、3 Consumer、3 Job的stable names/dispositions与body-free DTO。 |
| Step 9 | prepare→call→finalize、Query no-write、consumer/job处理点与29条flow。 |
| Step 10～13 | 17状态机、error taxonomy、commit/effect unknown、idempotency exact replay与并发冲突。 |
| Step 14 | exact capability、runtime binding snapshot、diagnostics/redaction binding与builder边界。 |
| `L4-observability`正式边界 | redaction-first、safe ref/body-free协作、no-write、外围失败不污染core；不得复制其observation truth或report/evidence机制。 |

## 3. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 哪些flow必须记录审计？ | accepted local mutation通过既有`LocalTransitionRecord`、`ProvenanceRecord`、proof/result/invocation、checkpoint/attempt/run、receipt/job result和runtime binding snapshot形成durable traceability。Query不写审计。Rejected before durable mutation只写best-effort runtime signal，不伪造provenance。 |
| 哪些错误分支必须记录日志？ | validation/hard-boundary拒绝、blocked/unsupported/unknown、idempotency conflict/in-flight/missing result、version/generation conflict、metadata integrity defect、lock/UoW/commit ambiguity、SDK/Git/fs malformed/unavailable/partial/unknown、consumer quarantine、job partial和config/binding reject。 |
| 哪些关键路径需要指标？ | 四类入口、idempotency、UoW/lock、owner/source、Git/fs apply、handoff/probe、conflict/unknown、consumer/job、config/capability与telemetry drop。 |
| 三类字段记录什么？ | log/span记录安全关联ref与阶段/分类；metric只记录低基数closed enum；durable audit只引用Step 6/11已有local refs/states/reasons/digests，不复制正文。 |
| 哪些留运维？ | sink/backend、export protocol、采样、保留、buffer、histogram buckets、dashboard、alerts、threshold、pager/runbook与生产health policy全部后置04/运维。 |

## 4. 当前闭环诊断

| 发现 | 风险 | 本步处置 |
|---|---|---|
| `DiagnosticsPort`已有名称但`SafeDiagnosticRecord`/result未闭口 | adapter可能接收任意map/raw exception | 定义exact body-free schema与非业务 emission disposition。 |
| 尚无log/metric/span test seam | 实现可能在domain直接调用产品SDK，无法验证泄漏/丢弃隔离 | 新增cross-cutting `SyncTelemetryPort`，由既有diagnostics adapter family实现；domain不依赖。 |
| provenance常被泛称“审计” | 可能误写成formal evidence/audit verdict | 明确它只是Sync-owned local relation/action history，不能升格。 |
| entry completion与local commit/external effect可能混淆 | 日志“success”会掩盖partial/unknown或ACK层 | 分离entry、commit、effect、external-owner四类event/span outcome。 |
| id/ref放metric label或raw path写log的诱惑 | 高基数、隐私、working-copy内容泄漏 | exact label allowlist；日志字段也禁止path/body/owner正文。 |
| telemetry sink失败可能触发业务retry | 重复Git/fs/handoff effect | signal全为best-effort side channel；failure不得影响result/state或重放。 |

## 5. 核心原则与边界

1. `log / metric / span / diagnostic emission` 是技术观察信号，不是 local business truth、owner truth、probe result、Review Decision、Artifact/Baseline、evidence、report或readiness。
2. Durable local traceability只来自Step 11 committed records。日志丢失不得通过重放Command/Consumer/Job、Git/fs apply、handoff或probe来“补齐”。
3. Domain object/policy不依赖telemetry。Entry/application/UoW/adapter wrappers负责埋点；repository只返回typed结果，不在底层偷偷记录业务成功。
4. Query保持zero-write：可发best-effort log/metric/span，但不得append diagnostic/provenance/observation/idempotency/audit record。
5. Signal必须redaction-first构造：先从typed result选择allowlisted field，再交sink；不得先serialize完整对象后做字符串替换。
6. Signal outcome按层命名：`entry_disposition`、`commit_disposition`、`effect_disposition`、`handoff_layer`不可压成`success`。
7. telemetry调用不得抛出到业务flow。sink dropped/unavailable/unknown只影响telemetry自身，不能改变command result或state；唯一例外是raw forbidden content在构造前被业务/adapter边界拒绝，拒绝原因仍是安全合同，不是sink结果。
8. Observability不提供正式probe。timeout/log absence/span status/metric count均不能关闭`OutcomeUnknown`。

## 6. Technical instrumentation contracts

### 6.1 文件与Port归属

| Contract | 计划位置 | 实现位置 | 调用者 | 禁止 |
|---|---|---|---|---|
| `SyncTelemetryPort` | `src/orchestration/sync_telemetry_port.ts` | `src/adapters/diagnostics/diagnostics_adapter.ts` | entry/application/UoW/adapter wrappers | domain、Query持久化、业务分支依赖sink结果 |
| `DiagnosticsPort` exact types | `src/review_handoff_provenance/ports/diagnostics_port.ts` | 同上 | 明确需要body-free support diagnostic的mutation/operations flow | raw log聚合、report/evidence生成 |
| redaction constructors | `src/adapters/diagnostics/diagnostics_adapter.ts` | same | telemetry/diagnostic adapter boundary | arbitrary object spread / `JSON.stringify(error)` |
| durable audit material | owning feature domain/repository files | metadata adapter | owning mutation/consumer/job flow | observability sink反写、补造或删除 |

### 6.2 Telemetry port

```ts
export type TelemetryEmissionDisposition =
  | "queued"
  | "dropped"
  | "unavailable";

export interface SyncSpanHandle {
  end(result: SyncSpanEnd): TelemetryEmissionDisposition;
}

export interface SyncTelemetryPort {
  tryEmitLog(record: SyncStructuredLogRecord): TelemetryEmissionDisposition;
  tryRecordMetric(record: SyncMetricRecord): TelemetryEmissionDisposition;
  tryStartSpan(input: SyncSpanStart): SyncResult<SyncSpanHandle, TelemetryStartError>;
}
```

`try*` methods是non-throwing contract；concrete adapter即使内部logger/exporter异常也必须归一为`dropped/unavailable`。Application只可将其交给best-effort wrapper并忽略disposition；不得把`queued`返回给public protocol或写入provenance。若记录drop counter本身也失败，必须终止递归观测，不再log该失败。

### 6.3 Exact common vocabulary

```ts
export type SyncTelemetryChannel = "command" | "query" | "consumer" | "job" | "runtime";

export type SyncTelemetryStage =
  | "entry"
  | "validation"
  | "idempotency"
  | "capability_preflight"
  | "read"
  | "lock"
  | "prepare_commit"
  | "effect_call"
  | "finalize_commit"
  | "response";

export type SyncEffectKind =
  | "none"
  | "metadata_commit"
  | "git_local_apply"
  | "filesystem_stage_commit"
  | "review_handoff"
  | "recovery_probe"
  | "diagnostic_emit";

export type SyncTelemetryEventCode =
  | "sync.entry.received"
  | "sync.entry.completed"
  | "sync.validation.rejected"
  | "sync.capability.checked"
  | "sync.idempotency.reserved"
  | "sync.idempotency.replayed"
  | "sync.idempotency.rejected"
  | "sync.uow.completed"
  | "sync.lock.completed"
  | "sync.dependency.call_completed"
  | "sync.local_effect.completed"
  | "sync.external_effect.completed"
  | "sync.conflict.detected"
  | "sync.recovery.required"
  | "sync.consumer.completed"
  | "sync.job.completed"
  | "sync.config.rejected"
  | "sync.telemetry.dropped";

export type SyncTelemetryOperationName =
  | SyncCommandName
  | SyncQueryName
  | SyncInboundConsumerName
  | SyncJobName
  | "runtime_composition";

export type SyncTelemetryOperationIdentity =
  | { readonly channel: "command"; readonly operation: SyncCommandName }
  | { readonly channel: "query"; readonly operation: SyncQueryName }
  | { readonly channel: "consumer"; readonly operation: SyncInboundConsumerName }
  | { readonly channel: "job"; readonly operation: SyncJobName }
  | { readonly channel: "runtime"; readonly operation: "runtime_composition" };

export type SyncTelemetryDisposition =
  | "received"
  | "completed_known"
  | "no_op_known"
  | "cancelled"
  | "failed_known"
  | "blocked"
  | "unsupported"
  | "unavailable"
  | "outcome_unknown"
  | "partial"
  | "duplicate_replayed"
  | "in_flight"
  | "conflict"
  | "quarantined"
  | "restricted"
  | "stale";

export type SyncTelemetryValidationCode =
  | "invalid_envelope"
  | "invalid_field"
  | "missing_explicit_selection"
  | "scope_mismatch"
  | "forbidden_content"
  | "hard_boundary_override"
  | "invalid_binding";

export type SyncTelemetryFieldCode =
  | "envelope"
  | "operation"
  | "actor"
  | "correlation_ref"
  | "request_ref"
  | "idempotency_key"
  | "project_ref"
  | "version_ref"
  | "material_source_ref"
  | "workspace_ref"
  | "local_target"
  | "path_scope"
  | "target_scope"
  | "metadata_generation"
  | "runtime_binding"
  | "config_section";

export type SyncTelemetryConfigSection =
  | "loader"
  | "boundary"
  | "execution"
  | "jobs"
  | "metadata"
  | "sdk"
  | "local_tools"
  | "support"
  | "operations";

export type SyncTelemetryFailureCode =
  | "duplicate_result_missing"
  | "version_conflict"
  | "generation_mismatch"
  | "integrity_failure"
  | "commit_status_unknown"
  | "dependency_unavailable"
  | "invalid_external_response"
  | "local_effect_partial"
  | "effect_outcome_unknown"
  | "telemetry_input_rejected";

export type SyncTelemetryCommitDisposition =
  | "not_started"
  | "committed_known"
  | "rolled_back_known"
  | "commit_status_unknown";

export type SyncTelemetryEffectDisposition =
  | "not_called"
  | "applied_known"
  | "accepted_by_transport"
  | "rejected_known"
  | "partial"
  | "outcome_unknown"
  | "blocked"
  | "unsupported"
  | "unavailable";

export type SyncTelemetryLockDisposition =
  | "acquired"
  | "released"
  | "contended"
  | "failed_known"
  | "outcome_unknown";

export type SyncTelemetrySignalKind = "log" | "metric" | "span" | "diagnostic";

export type SyncStructuredLogRecord =
  | {
      readonly eventCode: "sync.entry.received" | "sync.entry.completed";
      readonly level: "debug" | "info";
      readonly channel: "command";
      readonly operationName: SyncCommandName;
      readonly stage: "entry" | "response";
      readonly disposition: SyncTelemetryDisposition;
      readonly correlationRef: CorrelationRef;
      readonly requestRef: ClientRequestRef;
      readonly operationRef: Optional<SyncOperationRef>;
      readonly durationMs: Optional<number>;
    }
  | {
      readonly eventCode: "sync.entry.received" | "sync.entry.completed";
      readonly level: "debug" | "info";
      readonly channel: "query";
      readonly operationName: SyncQueryName;
      readonly stage: "entry" | "response";
      readonly disposition: SyncTelemetryDisposition;
      readonly correlationRef: CorrelationRef;
      readonly durationMs: Optional<number>;
    }
  | {
      readonly eventCode: "sync.entry.received";
      readonly level: "debug";
      readonly channel: "consumer";
      readonly operationName: SyncInboundConsumerName;
      readonly stage: "entry";
      readonly disposition: "received";
      readonly correlationRef: CorrelationRef;
      readonly eventId: Optional<EventId>;
    }
  | {
      readonly eventCode: "sync.entry.received";
      readonly level: "debug" | "info";
      readonly channel: "job";
      readonly operationName: SyncJobName;
      readonly stage: "entry";
      readonly disposition: "received";
      readonly correlationRef: CorrelationRef;
      readonly jobRunRef: JobRunRef;
    }
  | {
      readonly eventCode: "sync.validation.rejected";
      readonly level: "warn";
      readonly channel: SyncTelemetryChannel;
      readonly operationName: SyncTelemetryOperationName;
      readonly stage: "validation";
      readonly validationCode: SyncTelemetryValidationCode;
      readonly fieldCode: Optional<SyncTelemetryFieldCode>;
      readonly correlationRef: Optional<CorrelationRef>;
    }
  | {
      readonly eventCode: "sync.capability.checked";
      readonly level: "debug" | "info" | "warn" | "error";
      readonly capability: SyncAdapterCapability;
      readonly availability: AdapterAvailability;
      readonly runtimeBindingSnapshotRef: Optional<RuntimeBindingSnapshotRef>;
      readonly failureCode: Optional<SyncTelemetryFailureCode>;
    }
  | {
      readonly eventCode:
        | "sync.idempotency.reserved"
        | "sync.idempotency.replayed"
        | "sync.idempotency.rejected";
      readonly level: "debug" | "info" | "warn" | "error";
      readonly channel: "command" | "consumer" | "job";
      readonly operationName: SyncCommandName | SyncInboundConsumerName | SyncJobName;
      readonly disposition: "reserved" | "duplicate_replayed" | "in_flight" | "conflict" | "failed_known";
      readonly failureCode: Optional<SyncTelemetryFailureCode>;
      readonly operationRef: Optional<SyncOperationRef>;
    }
  | {
      readonly eventCode: "sync.uow.completed";
      readonly level: "debug" | "info" | "warn" | "error";
      readonly stage: "prepare_commit" | "finalize_commit";
      readonly commitDisposition: SyncTelemetryCommitDisposition;
      readonly operationRef: Optional<SyncOperationRef>;
      readonly checkpointRef: Optional<RecoveryCheckpointRef>;
      readonly durationMs: number;
    }
  | {
      readonly eventCode: "sync.lock.completed";
      readonly level: "debug" | "warn" | "error";
      readonly action: "acquire" | "release";
      readonly disposition: SyncTelemetryLockDisposition;
      readonly operationKind: Optional<SyncOperationKind>;
      readonly durationMs: number;
    }
  | {
      readonly eventCode:
        | "sync.dependency.call_completed"
        | "sync.local_effect.completed"
        | "sync.external_effect.completed";
      readonly level: "debug" | "info" | "warn" | "error";
      readonly capability: SyncAdapterCapability;
      readonly effectKind: SyncEffectKind;
      readonly effectDisposition: SyncTelemetryEffectDisposition;
      readonly operationRef: Optional<SyncOperationRef>;
      readonly checkpointRef: Optional<RecoveryCheckpointRef>;
      readonly attemptRef: Optional<ExternalAttemptRef>;
      readonly probeRef: Optional<ProbeRecordRef>;
      readonly runtimeBindingSnapshotRef: Optional<RuntimeBindingSnapshotRef>;
      readonly durationMs: number;
    }
  | {
      readonly eventCode: "sync.conflict.detected" | "sync.recovery.required";
      readonly level: "info" | "warn" | "error";
      readonly operationRef: Optional<SyncOperationRef>;
      readonly conflictKind: Optional<SyncConflictKind>;
      readonly checkpointRef: Optional<RecoveryCheckpointRef>;
      readonly nextAction: "inspect" | "revalidate" | "replan" | "probe" | "manual_resolution" | "cancel";
    }
  | {
      readonly eventCode: "sync.consumer.completed";
      readonly level: "info" | "warn" | "error";
      readonly channel: "consumer";
      readonly operationName: SyncInboundConsumerName;
      readonly disposition: SyncTelemetryDisposition;
      readonly correlationRef: Optional<CorrelationRef>;
      readonly eventId: Optional<EventId>;
      readonly durationMs: number;
    }
  | {
      readonly eventCode: "sync.job.completed";
      readonly level: "info" | "warn" | "error";
      readonly channel: "job";
      readonly operationName: SyncJobName;
      readonly disposition: SyncTelemetryDisposition;
      readonly correlationRef: Optional<CorrelationRef>;
      readonly jobRunRef: JobRunRef;
      readonly processedCount: Optional<number>;
      readonly blockedCount: Optional<number>;
      readonly failedKnownCount: Optional<number>;
      readonly durationMs: number;
    }
  | {
      readonly eventCode: "sync.config.rejected";
      readonly level: "error";
      readonly sectionCode: SyncTelemetryConfigSection;
      readonly validationCode: SyncTelemetryValidationCode;
      readonly profileRef: Optional<SyncRuntimeProfileRef>;
    }
  | {
      readonly eventCode: "sync.telemetry.dropped";
      readonly level: "warn";
      readonly signalKind: SyncTelemetrySignalKind;
      readonly sinkDisposition: "dropped" | "unavailable";
      readonly failureCode: "telemetry_input_rejected" | "dependency_unavailable";
    };

export type SyncMetricRecord =
  | { readonly metric: "sync_entry_total"; readonly value: 1; readonly labels: SyncTelemetryOperationIdentity & { readonly disposition: SyncTelemetryDisposition } }
  | { readonly metric: "sync_entry_duration_ms"; readonly value: number; readonly labels: SyncTelemetryOperationIdentity }
  | { readonly metric: "sync_validation_rejection_total"; readonly value: 1; readonly labels: { readonly boundary: "protocol" | "config" | "adapter" | "metadata"; readonly reasonKind: SyncTelemetryValidationCode } }
  | { readonly metric: "sync_idempotency_total"; readonly value: 1; readonly labels: { readonly channel: "command" | "consumer" | "job"; readonly operation: SyncCommandName | SyncInboundConsumerName | SyncJobName; readonly outcome: "reserved" | "duplicate_replayed" | "in_flight" | "conflict" | "missing_result" } }
  | { readonly metric: "sync_uow_total"; readonly value: 1; readonly labels: { readonly phase: "prepare_commit" | "finalize_commit" | "rollback"; readonly outcome: SyncTelemetryCommitDisposition } }
  | { readonly metric: "sync_uow_duration_ms"; readonly value: number; readonly labels: { readonly phase: "prepare_commit" | "finalize_commit" | "rollback"; readonly outcome: SyncTelemetryCommitDisposition } }
  | { readonly metric: "sync_target_lock_total"; readonly value: 1; readonly labels: { readonly action: "acquire" | "release"; readonly outcome: SyncTelemetryLockDisposition } }
  | { readonly metric: "sync_dependency_call_total"; readonly value: 1; readonly labels: { readonly capability: SyncAdapterCapability; readonly outcome: SyncTelemetryEffectDisposition } }
  | { readonly metric: "sync_dependency_call_duration_ms"; readonly value: number; readonly labels: { readonly capability: SyncAdapterCapability; readonly outcome: SyncTelemetryEffectDisposition } }
  | { readonly metric: "sync_local_effect_total"; readonly value: 1; readonly labels: { readonly effectKind: "git_local_apply" | "filesystem_stage_commit"; readonly outcome: SyncTelemetryEffectDisposition } }
  | { readonly metric: "sync_handoff_total"; readonly value: 1; readonly labels: { readonly handoffStage: "submit" | "decision_read" | "probe"; readonly outcome: SyncTelemetryEffectDisposition } }
  | { readonly metric: "sync_conflict_total"; readonly value: 1; readonly labels: { readonly conflictKind: SyncConflictKind } }
  | { readonly metric: "sync_outcome_unknown_total"; readonly value: 1; readonly labels: { readonly effectKind: SyncEffectKind; readonly stage: "effect_call" | "finalize_commit" } }
  | { readonly metric: "sync_recovery_action_total"; readonly value: 1; readonly labels: { readonly operation: "resume" | "probe" | "cancel" | "record_resolution"; readonly disposition: SyncTelemetryDisposition } }
  | { readonly metric: "sync_consumer_total"; readonly value: 1; readonly labels: { readonly consumer: SyncInboundConsumerName; readonly disposition: ConsumerDisposition } }
  | { readonly metric: "sync_job_item_total"; readonly value: number; readonly labels: { readonly job: SyncJobName; readonly itemDisposition: "processed" | "no_op" | "blocked" | "failed_known" | "outcome_unknown" } }
  | { readonly metric: "sync_capability_binding"; readonly value: 0 | 1; readonly labels: { readonly capability: SyncAdapterCapability; readonly availability: AdapterAvailability } }
  | { readonly metric: "sync_telemetry_dropped_total"; readonly value: 1; readonly labels: { readonly signalKind: SyncTelemetrySignalKind; readonly reasonKind: "invalid_input" | "sink_rejected" | "sink_unavailable" } };

export type SyncSpanStart =
  | { readonly spanName: "sync.command"; readonly commandName: SyncCommandName; readonly correlationRef: CorrelationRef; readonly requestRef: ClientRequestRef; readonly operationRef: Optional<SyncOperationRef> }
  | { readonly spanName: "sync.query"; readonly queryName: SyncQueryName; readonly correlationRef: CorrelationRef }
  | { readonly spanName: "sync.consumer"; readonly consumerName: SyncInboundConsumerName; readonly correlationRef: CorrelationRef; readonly eventId: Optional<EventId> }
  | { readonly spanName: "sync.job"; readonly jobName: SyncJobName; readonly correlationRef: CorrelationRef; readonly jobRunRef: JobRunRef }
  | { readonly spanName: "sync.uow"; readonly phase: "prepare_commit" | "finalize_commit" | "rollback"; readonly operationKind: Optional<SyncOperationKind>; readonly operationRef: Optional<SyncOperationRef> }
  | { readonly spanName: "sync.metadata_lock"; readonly action: "acquire" | "release"; readonly operationKind: Optional<SyncOperationKind> }
  | { readonly spanName: "sync.owner_read" | "sync.source_read" | "sync.local_observation"; readonly capability: SyncAdapterCapability; readonly runtimeBindingSnapshotRef: Optional<RuntimeBindingSnapshotRef> }
  | { readonly spanName: "sync.local_apply"; readonly effectKind: "git_local_apply" | "filesystem_stage_commit"; readonly runRef: MaterializationRunRef; readonly checkpointRef: RecoveryCheckpointRef }
  | { readonly spanName: "sync.review_handoff"; readonly attemptRef: HandoffAttemptRef; readonly checkpointRef: RecoveryCheckpointRef; readonly runtimeBindingSnapshotRef: RuntimeBindingSnapshotRef }
  | { readonly spanName: "sync.recovery_probe"; readonly attemptRef: ExternalAttemptRef; readonly probeRef: ProbeRecordRef; readonly checkpointRef: RecoveryCheckpointRef }
  | { readonly spanName: "sync.runtime_composition"; readonly profileRef: Optional<SyncRuntimeProfileRef> };

export type SyncSpanEnd =
  | { readonly kind: "entry"; readonly technicalStatus: "ok" | "error" | "unset"; readonly disposition: SyncTelemetryDisposition; readonly durationMs: number }
  | { readonly kind: "commit"; readonly technicalStatus: "ok" | "error" | "unset"; readonly commitDisposition: SyncTelemetryCommitDisposition; readonly durationMs: number }
  | { readonly kind: "effect"; readonly technicalStatus: "ok" | "error" | "unset"; readonly effectDisposition: SyncTelemetryEffectDisposition; readonly durationMs: number }
  | { readonly kind: "composition"; readonly technicalStatus: "ok" | "error" | "unset"; readonly availabilityCounts: { readonly bound: number; readonly blocked: number; readonly unsupported: number; readonly unknown: number }; readonly disposition: "built" | "rejected"; readonly durationMs: number };

export type TelemetryStartError =
  | { readonly kind: "invalid_telemetry_input"; readonly reason: "schema_mismatch" | "forbidden_field" | "unbounded_value" }
  | { readonly kind: "sink_unavailable" }
  | { readonly kind: "sink_rejected"; readonly reason: "capacity" | "unsupported_signal" };
```

上述所有`number`字段都必须在constructor处验证为finite且非负；`fieldCode`只能由protocol/config validator的closed field vocabulary映射，不得回填raw field/value。`SyncStructuredLogRecord`、`SyncMetricRecord`与`SyncSpanStart/End`只能由event-specific constructor生成；不得开放`Record<string, unknown>`、任意attributes map或object spread。`SyncSpanHandle`必须记住start的`spanName`，只接受与其类别匹配的end variant；不匹配时drop并返回`dropped`，不得抛出或改变业务flow。

### 6.4 Safe common correlation fields

| 字段 | 来源 | 允许范围 | 约束 |
|---|---|---|---|
| `correlationRef` | trusted envelope metadata | log/span；不作metric label | 经runtime validation；不生成新ref替代caller context。 |
| `requestRef` | Command metadata | Command entry log/span | 仅local client request ref；Query协议没有该字段，不得为Query伪造；不打印request body。 |
| `operationRef` | persisted/new local operation | post-create log/span/diagnostic | absent时不得伪造；可用于关联local records。 |
| `jobRunRef` | Job metadata | job log/span | 不作label；不替代idempotency key。 |
| `eventId` | validated consumer envelope | consumer log/span | 只在source visibility/redaction允许时；不作label。 |
| `checkpointRef` / `attemptRef` / `probeRef` | committed local records | unknown/recovery log/span | only exact typed refs；不记录external body/ref details。 |
| `runtimeBindingSnapshotRef` | operation/current composition | capability/effect log/span | 表示使用的binding context，不表示ready。 |
| `provenanceRefs` | committed result | completion diagnostic only | bounded数量；不在metric label或pre-commit success log。 |

默认禁止把`ActorRef`、`PrincipalRef`、Project/Version/Source/Workspace/Artifact/Governance/Archive refs放入runtime log/metric/span。若未来安全审计要求，必须由正式visibility/redaction合同新增专用safe reference type并回流本Step，不能直接记录。

## 7. 结构化日志埋点表

### 7.1 Entry / protocol

| 位置 | 级别 | event code / 允许字段 | 目的与语义 |
|---|---|---|---|
| 10 Command entry received | debug | `sync.entry.received`; channel、commandName、correlation/request refs、stage | 只表示envelope通过最小decode，不表示accepted/reserved。 |
| 13 Query entry received/completed | debug/info | received/completed；queryName、read disposition、correlation/request refs、duration | no-write；complete只表示read completeness。 |
| 3 Consumer envelope rejected/completed | warn/info | validation rejected或consumer completed；consumerName、eventName、eventId?、schema disposition、receipt disposition | 不记录payload/source body；processed不等source truth accepted。 |
| 3 Job entry/completion | info | received/job completed；jobName、jobRunRef、job disposition、bounded counts、duration | counts不等全局resolved/readiness。 |
| metadata/body/scope validation reject | warn | `sync.validation.rejected`; channel、operation name、validation code、field code、correlation ref | 不打印raw value/path/body。 |
| public response completion | info | `sync.entry.completed`; exact public disposition、operationRef?、duration | 不使用success bool；commit/effect层另记。 |

### 7.2 Idempotency / persistence / concurrency

| 位置 | 级别 | event code / 允许字段 | 目的与语义 |
|---|---|---|---|
| reservation result | debug/info/warn | reserved/replayed/rejected；channel、operationName、reservation disposition | raw key/request digest禁止；duplicate log不新增transition/provenance。 |
| missing/wrong replay carrier | error | idempotency rejected；channel、operationName、`duplicate_result_missing`/consistency code | 不从current truth重建result。 |
| UoW begin/known commit/rollback | debug/info/warn | `sync.uow.completed`; phase、commit disposition、operationRef?、duration | known commit success仅说明local UoW。 |
| commit status unknown | error | UoW completed；`commit_status_unknown`、operationRef?、checkpointRef? | 不声称rollback/success；原identity reload。 |
| version/generation/unique conflict | warn | UoW completed；resource class、typed error kind | 不记录expected/actual token、generation值或record body。 |
| target lock acquire/release | debug/warn | `sync.lock.completed`; action、disposition、operation kind、duration | lock acquired不证明用户/Git进程排他；不打target/path。 |
| runtime binding snapshot ensure | debug/error | capability checked；ensure disposition、snapshotRef、consistency code? | snapshot不是readiness；same-ref mismatch为defect。 |

### 7.3 Owner / Git / filesystem / handoff

| 位置 | 级别 | event code / 允许字段 | 目的与语义 |
|---|---|---|---|
| owner access/posture read | debug/warn | dependency call；capability、call disposition、duration、snapshotRef? | 不记录owner body/private denial reason；known allowed仍需domain gate。 |
| material source read | debug/warn | dependency call；capability、delta kind/continuity class、duration | 不记录cursor/version值、source items/body。 |
| Git/fs observation | debug/warn | dependency call；capability、safe observation axis disposition、duration | 不记录repo path、branch、file names、stdout/stderr/diff。 |
| Git/fs stage/apply | info/warn/error | local effect completed；effect kind、known/partial/outcome_unknown、run/checkpoint refs、duration | no path list/content；unknown不重放。 |
| review handoff call | info/warn/error | external effect completed；transport layer disposition、attempt/checkpoint refs、duration | ACK/HTTP code不写accepted；不记录request/response body。 |
| Decision read / formal probe | debug/info/warn | dependency/external effect completed；read/probe disposition、attempt/probe refs、duration | known probe不自动等approved；no telemetry inference。 |
| diagnostics emit | debug/warn | dependency call；diagnostic code、emission disposition | 不写diagnostic body；failure不改业务result。 |

### 7.4 Config / capability / integrity

| 位置 | 级别 | event code / 允许字段 | 目的与语义 |
|---|---|---|---|
| raw config validation reject | error | `sync.config.rejected`; section code、validation issue code、profileRef? | 禁止raw key/value/source path/endpoint/secret。 |
| hard-boundary override reject | error | config rejected；hard boundary code | 说明runtime未构造；不回显非法值。 |
| adapter binding classification | info/warn | capability checked；capability、availability、reason kind、snapshotRef | bound不表示health/integration ready。 |
| metadata/provenance integrity defect | error | conflict/recovery required；defect code、operation/manifest/provenance ref中允许的local ref | 不打印坏record/body；不自动修复。 |
| conflict detected / recovery required | info/warn | conflict/recovery event；conflict kind、next-action class、local refs | manual intent不等effect或resolved。 |
| telemetry drop | warn only if safe/non-recursive | telemetry dropped；signal kind、sink disposition | drop-log再失败即静默计数尝试终止。 |

日志级别不是状态机输入，且不得用于retry eligibility。具体level mapping若产品需要改变可在运维层调整，但`error`事件不能因此被解释为business terminal，`info`也不能解释为accepted/readiness。

## 8. 指标埋点表

| 指标 | 类型 / 单位 | 打点位置 | 标签白名单 |
|---|---|---|---|
| `sync_entry_total` | counter / calls | 四类entry完成 | `channel`, `operation`, `disposition` |
| `sync_entry_duration_ms` | histogram / ms | 四类entry完成 | `channel`, `operation` |
| `sync_validation_rejection_total` | counter | entry/config/adapter decode reject | `boundary`, `reason_kind` |
| `sync_idempotency_total` | counter | reserve/replay/conflict/in-flight/missing carrier | `channel`, `operation`, `outcome` |
| `sync_uow_total` | counter | begin/commit/rollback result | `phase`, `outcome` |
| `sync_uow_duration_ms` | histogram / ms | UoW phase结束 | `phase`, `outcome` |
| `sync_target_lock_total` | counter | acquire/release | `action`, `outcome` |
| `sync_dependency_call_total` | counter | SDK/Git/fs/diagnostic calls | `capability`, `outcome` |
| `sync_dependency_call_duration_ms` | histogram / ms | dependency call结束 | `capability`, `outcome` |
| `sync_local_effect_total` | counter | Git/fs apply结束 | `effect_kind`, `outcome` |
| `sync_handoff_total` | counter | submit/read/probe结束 | `handoff_stage`, `outcome` |
| `sync_conflict_total` | counter | new conflict classification committed | `conflict_kind` |
| `sync_outcome_unknown_total` | counter | first durable unknown classification | `effect_kind`, `stage` |
| `sync_recovery_action_total` | counter | explicit resume/probe/cancel/record-resolution完成 | `operation`, `disposition` |
| `sync_consumer_total` | counter | consumer receipt返回 | `consumer`, `disposition` |
| `sync_job_item_total` | counter / items | per-item result known | `job`, `item_disposition` |
| `sync_capability_binding` | gauge / 0-or-1 per current composition | builder completes classification | `capability`, `availability` |
| `sync_telemetry_dropped_total` | counter | telemetry adapter拒绝/不可用 | `signal_kind`, `reason_kind` |

规则：

- `operation/consumer/job/capability/disposition`必须来自Step 8/12/14 exact unions，不接受provider或user string。
- 禁止任何ID/ref、actor/principal/project/version/source/target/path、branch、cursor、generation、entity version、key/digest、endpoint、error text、file extension作为label。
- Histogram bucket、gauge scrape model、cardinality budget与告警阈值留给04/运维；本文只固定metric name/type/unit/label schema。
- Counter表示观测到的调用/分类次数，不是unique business transition计数；duplicate、sink drop与process crash意味着不承诺exactly-once telemetry。
- `sync_capability_binding`只暴露当前composition静态分类，不是health/readiness probe；禁止汇总成`sync_ready=1`。

## 9. Trace / span 契约

### 9.1 Span inventory

| Span name | 开始位置 | 结束位置 | attributes allowlist | 禁止解释 |
|---|---|---|---|---|
| `sync.command` | Command envelope validated | public result/error构造后 | commandName、correlation/request/operation refs、entry disposition | span OK ≠ local/external success。 |
| `sync.query` | Query envelope validated | response/error构造后 | queryName、correlation/request refs、read disposition | 不触发write/refresh。 |
| `sync.consumer` | envelope minimum validation后 | receipt/error返回 | consumer/event names、eventId?、receipt disposition | processed ≠ owner truth changed。 |
| `sync.job` | job request validated | stored result/error返回 | jobName/jobRunRef/disposition/counts | completed ≠ all targets resolved/readiness。 |
| `sync.uow` | begin前 | known commit/rollback/unknown后 | phase、operation kind、commit disposition、operationRef? | 不跨SDK/Git/fs形成distributed transaction。 |
| `sync.metadata_lock` | acquire前 | release/failed/unknown后 | action、disposition、duration | 不记录target。 |
| `sync.owner_read` | SDK read前 | mapped PortResult后 | capability、call disposition、runtime snapshot ref | 不带body/permission detail。 |
| `sync.source_read` | source adapter call前 | mapped delta/capability result后 | capability、delta/continuity class | 不带cursor/items。 |
| `sync.local_observation` | Git/fs read前 | safe observation/result后 | capability、axis disposition | 不带path/output。 |
| `sync.local_apply` | typed effect request前 | known/partial/unknown mapped后 | effect kind、run/checkpoint refs、disposition | OK只代表adapter-known local effect层。 |
| `sync.review_handoff` | prepared attempt已commit且call前 | transport/unknown mapped后 | attempt/checkpoint refs、transport disposition | ACK≠accepted。 |
| `sync.recovery_probe` | probe invocation已commit且call前 | probe result mapped后 | attempt/probe refs、disposition | probe known≠approved。 |
| `sync.runtime_composition` | validated config进入builder | facade/snapshot或typed reject | profileRef?、capability counts by availability、outcome | facade built≠integration ready。 |

### 9.2 Span linking 与 status

- Parent/child仅表达当前进程调用关系；跨进程trace propagation尚无正式SDK/event合同，不虚构W3C/header字段。
- Probe span可以用body-free link关联prior handoff span context（若正式validated context存在），但prior span缺失不阻塞formal probe，也不能由trace backend查找代替attempt ref。
- Span technical status=`ok/error/unset`只描述instrumented call是否正常结束；业务disposition始终用typed attribute。`OutcomeUnknown`不得用`ok`或`error`消解。
- Sampling不得影响durable prepare/provenance/receipt/result；unsampled trace不改变业务或审计完整性。
- Span exporter失败遵循telemetry drop语义，不重放effect，不写checkpoint，不改变public result。

## 10. Safe diagnostic contract

```ts
export type SafeDiagnosticCode =
  | "validation_rejected"
  | "capability_blocked"
  | "dependency_unavailable"
  | "version_conflict"
  | "integrity_defect"
  | "commit_status_unknown"
  | "local_effect_partial"
  | "effect_outcome_unknown"
  | "consumer_quarantined"
  | "job_partial";

export type SafeDiagnosticSupportingRef =
  | AccessEvaluationRef
  | EligibilityProofRef
  | LocalOperationResultRef
  | OperationTransitionRef
  | MetadataTransitionRef
  | MetadataManifestRef
  | MaterializationRunRef
  | ConflictRecordRef
  | ManualResolutionRef
  | ProbeRecordRef
  | HandoffAttemptRef
  | RuntimeBindingSnapshotRef
  | OpaqueRef<"config_validation_issue">;

export interface SafeDiagnosticRecord {
  readonly diagnosticRef: OpaqueRef<"safe_diagnostic">;
  readonly code: SafeDiagnosticCode;
  readonly correlationRef: CorrelationRef;
  readonly operationRef: Optional<SyncOperationRef>;
  readonly checkpointRef: Optional<RecoveryCheckpointRef>;
  readonly capability: Optional<SyncAdapterCapability>;
  readonly safeFailureRefs: ReadonlyArray<SafeDiagnosticSupportingRef>;
  readonly provenanceRefs: ProvenanceRecordRefSet;
  readonly redactionMarker: RedactionMarker;
  readonly observedAt: ObservedAt;
}

export type DiagnosticEmissionResult =
  | { readonly kind: "recorded_by_sink" }
  | { readonly kind: "not_recorded"; readonly reason: "dropped" | "unavailable" }
  | { readonly kind: "recording_outcome_unknown" };
```

`safeFailureRefs`只允许Step 6/12定义的body-free local issue/failure refs；不得塞自由字符串、external refs正文或文件路径。`recorded_by_sink`只表示sink已知接收，不是artifact/report/evidence，也不成为operation完成前置。`recording_outcome_unknown`不触发diagnostic重试或业务checkpoint。`GetSyncDiagnosticSummary`仍从Step 11 persisted safe business/technical records读取，不反查log/trace sink，也不以`DiagnosticEmissionResult`构造readiness。

## 11. Local durable audit / provenance matrix

本表中的“审计材料”是Sync-owned local action/provenance history，不是平台formal Audit、合规证据或验收报告；不新增`AuditEvent`、audit ledger、outbox或outbound event。

| 处理点 | 必须提交的既有材料 | 必须回链 | 明确不写 |
|---|---|---|---|
| operation建立/状态迁移 | `SyncOperation` + `LocalTransitionRecord` + `ProvenanceRecord` + runtime binding snapshot ref | selection、actor/cause、correlation、from/to state | raw request、permission body、telemetry receipt。 |
| eligibility accepted/blocked | `AccessEvaluation`、owner safe snapshots、`EligibilityProofRecord`仅eligible branch | selection/action/snapshot refs | owner body、local allow assertion。 |
| metadata init/migrate/rebind | binding/manifest/generation transition + provenance | old/new refs、explicit actor/reason | silent overwrite/delete old generation。 |
| materialization prepare/finalize | plan/path/run/checkpoint；finalize时cursor/mapping/provenance/local result | source delta、generation、fingerprints、run | file body/diff/Git commit as Artifact。 |
| conflict/manual/recovery | conflict/checkpoint/manual resolution/probe + provenance | affected typed refs、actor intent、prior attempt | auto decision、log-derived resolution。 |
| push-review | candidate evaluation/freeze、attempt/invocation/checkpoint/provenance | exact runtime snapshot、candidate digest/scope、transport/probe/Decision safe refs | request body、ACK-as-accepted、Review verdict。 |
| duplicate Command | existing stored command result only | original identity/digest/result/snapshot context | new transition/provenance/invocation。 |
| accepted Consumer | conservative transitions + provenance + receipt/idempotency completion | source event identity/digest + affected refs | raw payload、auto pull/handoff。 |
| Job item/final | per-item owning transition/provenance where changed + complete stored job result | job/run/key namespace、item refs/dispositions | fabricated old report、global readiness。 |
| Query | none | current authorized reads only | UoW/idempotency/provenance/diagnostic append。 |
| config reject | none in `.qs-sync` business truth | best-effort safe log/metric only | raw config, secret, fake audit record。 |

Persisted material is authoritative only for its exact local claim: provenance proves a local recorded relation/integrity posture, invocation proves durable-before-call identity, receipt proves local consumer handling disposition, job result proves bounded run result. None proves external integration, owner acceptance, source correctness beyond stored safe ref, or production execution.

## 12. Redaction and forbidden-field matrix

| Field/content | Log | Metric label | Span | Safe diagnostic | `.qs-sync` durable traceability |
|---|---|---|---|---|---|
| secret/token/credential material | forbidden | forbidden | forbidden | forbidden | forbidden |
| credential ref | forbidden by default | forbidden | forbidden | forbidden | only protocol context where already required; never secret |
| raw request/event/provider response | forbidden | forbidden | forbidden | forbidden | forbidden |
| file content/diff/path list/stdout/stderr | forbidden | forbidden | forbidden | forbidden | body forbidden；canonical typed path refs only where domain object requires |
| absolute target/repo path | forbidden | forbidden | forbidden | forbidden | canonical target ref only；no path body in observability |
| arbitrary exception/stack/debug dump | forbidden | forbidden | forbidden | forbidden | stable safe code/ref only |
| actor/principal/project/version/source/owner refs | forbidden by default | forbidden | forbidden by default | forbidden | typed refs only in owning local record as designed |
| correlation/request/operation/job/event refs | allowed at listed points | forbidden | allowed at listed points | bounded subset | typed local/protocol record fields |
| idempotency key / request digest value | forbidden | forbidden | forbidden | forbidden | required typed stores only |
| entity version/generation/cursor/Git oid values | forbidden | forbidden | forbidden | forbidden | owning typed local record only |
| capability/operation/disposition/error enum | allowed | allowed allowlist | allowed | allowed subset | owning state/result as designed |
| provenance/checkpoint/attempt/probe refs | bounded allowlist | forbidden | bounded allowlist | bounded allowlist | allowed/required |
| artifact/report/evidence/verdict/signoff/readiness content or claim | forbidden | forbidden | forbidden | forbidden | forbidden；only external typed ref if a future formal contract explicitly permits |

Redaction marker不能使原本禁止的body变得可保存；它只说明allowlisted safe record经过何种裁剪。Hashing raw path/key/actor不自动安全，仍禁止，除非未来正式威胁模型和linkability policy批准专用类型。

## 13. Failure isolation and delivery semantics

| 场景 | 必须行为 | 禁止行为 |
|---|---|---|
| telemetry adapter unavailable at startup | capability=`blocked/unsupported/unknown`；core route是否可运行按diagnostics optionality返回degraded | 将telemetry当owner/gate前置或伪造bound。 |
| log/metric/span emit dropped | business flow继续；best-effort drop counter；无递归 | rollback local commit、retryeffect、改public result。 |
| diagnostic emit unknown | business result不变；不以新key重发 | 建checkpoint/probe或称recorded。 |
| durable provenance write failure before commit | owning UoW失败/unknown，按Step 11/12恢复 | 用日志代替provenance后宣称成功。 |
| local commit success但completion log失败 | result仍由stored carrier返回 | 重跑Command补log。 |
| external effect unknown但span显示error | `OutcomeUnknown/ProbeRequired`保持 | 由span status推断未发生。 |
| telemetry contains forbidden field | constructor reject/drop该signal并记录安全计数（若可） | 发送后再依赖sink清洗。 |
| process crash before telemetry flush | 接受signal缺失；以committed local records恢复业务 | 把缺log当业务未发生。 |

## 14. Step 16 测试切口预告

| Test cut | 验证内容 | 当前状态 |
|---|---|---|
| `TC-SYNC-OBS-001` | 10 Command、13 Query、3 Consumer、3 Job entry均生成正确closed event/metric names | 仅设计，未运行 |
| `TC-SYNC-OBS-002` | exact public disposition分层；无top-level success/accepted/readiness | 仅设计，未运行 |
| `TC-SYNC-OBS-003` | raw secret/body/path/stdout/stderr/stack canary不进入任何signal | 仅设计，未运行 |
| `TC-SYNC-OBS-004` | metric label仅低基数allowlist；任意ID/ref/key/digest拒绝 | 仅设计，未运行 |
| `TC-SYNC-OBS-005` | Query有signal但zero UoW/write/provenance/diagnostic emit | 仅设计，未运行 |
| `TC-SYNC-OBS-006` | sink throw/drop/unavailable不改变business result/state/port call count | 仅设计，未运行 |
| `TC-SYNC-OBS-007` | duplicate replay不新增transition/provenance/effect；可记replay signal | 仅设计，未运行 |
| `TC-SYNC-OBS-008` | commit/effect unknown不能被log/span/metric改为known或自动retry | 仅设计，未运行 |
| `TC-SYNC-OBS-009` | ACK/HTTP/local Git/spans不产生Review accepted/Artifact/Baseline字段 | 仅设计，未运行 |
| `TC-SYNC-OBS-010` | `GetSyncDiagnosticSummary`只读persisted safe slices，不查询telemetry sink | 仅设计，未运行 |
| `TC-SYNC-OBS-011` | local durable material与signal failure分离；log不可替代provenance | 仅设计，未运行 |
| `TC-SYNC-OBS-012` | diagnostic emission result不进入command success/unknown recovery | 仅设计，未运行 |

## 15. 前序契约回填审计

| 前序 Step | 发现 | 回填动作 / 结论 |
|---|---|---|
| Step 4 | 既有diagnostics adapter可实现sink，但缺cross-cutting port文件 | 回补`src/orchestration/sync_telemetry_port.ts` planned path与职责；不新增业务模块。 |
| Step 6 | provenance/technical carriers足够；`SafeDiagnosticRecord`未闭口 | 本步exact schema，不新增lifecycle/audit truth。 |
| Step 7 | `DiagnosticsPort`已有；缺telemetry port与exact result | 回补`SyncTelemetryPort`和本步schema引用；diagnostic/query职责仍分开。 |
| Step 8 | entry names/dispositions是signal enum authority | pass；不新增public protocol或outbound event。 |
| Step 9 | 29 flows已有effect/commit边界 | pass；埋点位于边界前后，不改变call order。 |
| Step 10 | state names不由log/metric重命名 | pass；metrics用object-qualified/closed categories。 |
| Step 11 | local durable audit materials齐全 | pass；不建observability store/audit ledger/outbox。 |
| Step 12 | stable error/disposition可映射signal | pass；safe code/ref only。 |
| Step 13 | duplicate/unknown语义完整 | pass；telemetry failure不重入。 |
| Step 14 | diagnostics/redaction/capability binding已定义 | pass；sink product/config/threshold留04/运维。 |

## 16. 回填草稿

> 校准来源：
> - `projects/L5-sync/design-calibration/03_ddd_step_15_observability_audit.md`
>
> 延伸阅读：§6 instrumentation contracts、§7 logs、§8 metrics、§9 spans、§10 diagnostics、§11 local durable audit、§12 forbidden matrix。

### 正式 §14 摘录草稿

L5-sync 的runtime observability由`SyncTelemetryPort`承接structured log、low-cardinality metric与span；`DiagnosticsPort`只发送body-free safe diagnostic。两者均由planned diagnostics adapter实现，sink failure或drop不得改变Command/Query/Consumer/Job结果、触发rollback/retry或关闭unknown。Domain不依赖telemetry，Query可发技术signal但继续zero-write。

所有signal使用closed event/stage/effect/capability/disposition vocabulary。日志/span只在明确位置携带bounded local correlation refs；metrics禁止任何ID/ref/key/digest/path/version/cursor。secret、credential、raw request/event/provider response、file content/diff/path、stdout/stderr、exception/stack、evidence/report/verdict/readiness在所有signal中永禁。

审计与追溯不新建平台Audit truth。Accepted local action继续由`LocalTransitionRecord`、`ProvenanceRecord`、proof/result/invocation、checkpoint/attempt/run、receipt/job result和runtime binding snapshot构成committed local history。日志/trace不能替代它们，也不能证明owner permission、source correctness、Artifact/Baseline、Review accepted或integration readiness。

## 17. 待确认事项

| 待确认项 | 当前姿态 | 后续承接 |
|---|---|---|
| L4-observability / SDK exact diagnostic/trace propagation surface | `SYNC-UP-001`下保持conditional/blocked；local no-op/drop-capable adapter contract only | owner合同回流Step 7/14/15 |
| sink/backend/export protocol | 未选择 | 04配置/实施计划 |
| sampling、buffer、retention、histogram buckets、cardinality budget | 未设数值 | 04/05/运维 |
| alert thresholds、SLO、dashboard、pager/runbook | 不属于03 | 运维/验收材料 |
| safe cross-process trace context/header schema | 未获正式SDK/event合同 | 上游合同回流 |
| metadata physical retention对local audit/snapshot的实现 | `SYNC-UP-006` blocked | 04/实现前adapter审计 |

`SYNC-UP-001~010`与`SYNC-LOCAL-001~005`均未因可观测性设计而关闭。Log、metric、span、diagnostic、fake或静态审计不能作为blocker关闭证据。

## 18. 进入 Step 16 条件与停审记录

- [x] 10 Command、13 Query、3 Consumer、3 Job及config/UoW/SDK/Git/fs/handoff均有明确log/metric/span切口。
- [x] structured fields、metric labels、span attributes与safe diagnostic schema为closed/typed集合。
- [x] `SyncStructuredLogRecord`、`SyncMetricRecord`、`SyncSpanStart`、`SyncSpanEnd`、`TelemetryStartError`与`SafeDiagnosticSupportingRef`均有exact定义，无任意attributes/ref容器。
- [x] durable local audit材料与runtime signal清楚分层，Query no-write保持。
- [x] sink failure/drop/unknown不改变business result、state或reentry。
- [x] redaction/forbidden-field矩阵覆盖secret/body/path/output/stack/high-cardinality/evidence边界。
- [x] 未选择产品/阈值/保留/采样/告警，未生成report/evidence/verdict/signoff/readiness。
- [x] 所有测试项仅为Step 16切口，未创建测试、未运行或声称结果。

结论：Step 15 `gate_status=pass_with_upstream_blockers`；允许按用户授权进入Step 16。
