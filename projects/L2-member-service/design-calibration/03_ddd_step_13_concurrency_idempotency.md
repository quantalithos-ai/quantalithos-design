# Step 13：并发、幂等与重入保护

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md`

## 1. Step 状态与目标

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 13 并发、幂等与重入保护 |
| 状态 | completed / pass_with_upstream_blockers |
| 输入 | Step 6~12 对象、Port、协议、flow、状态、持久化和错误契约 |
| 正式正文 | 仍禁止写入，直到 Step 19 |
| 不在本步锁定 | lock 产品、lease 时长、hash crate、retry/backoff 数值、数据库 schema、broker/DLQ、transport code |

本步把同步 Command、异步 Consumer、Operations Job、outbox publisher、projection rebuild、reference refresh、cleanup 和 handoff 任务中的并发控制与重入行为固定为可实现的规则。并发控制保护的是本地 truth 或 local marker，不把 scheduler、broker offset、timeout 或 adapter availability 变成业务状态。

## 2. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 哪些入口会并发修改同一资源？ | Command 会竞争 Host-owned truth；Consumer 会竞争 signal/attempt/cleanup/handoff marker；Job 会竞争 outbox/projection/reconciliation 和已提交 attempt；Query 永远只读。 |
| 幂等键从哪里来？ | Command 从 `HostCommandMetadata.idempotency_key`；Consumer 从 envelope 的 dedup key；Job 从 `HostJobEnvelope.idempotency_key`；outbox 单记录用 `HostOutboxRecordRef + HostRevision`，不占用 public operation key。 |
| 同 key 同 digest 怎么办？ | 只读取并返回已存的 command outcome、consumer receipt 或 job report；不重新执行 domain、resolver、publisher 或 handoff。 |
| 同 key 不同 digest 怎么办？ | 返回 `ApplicationError::IdempotencyConflict` / stable conflict surface；不能覆盖第一次请求。 |
| reservation in-flight 怎么办？ | 返回 delayed/unavailable，等待同 key 结果；禁止第二个 writer 穿过 domain。 |
| commit unknown 怎么办？ | 不盲重试、不发送补偿写；按原 key 查询 reservation 和 stored result，必要时进入 reconciliation。 |
| Query 是否参与幂等？ | 否。Query 不 reserve、不写 stored result、不因重复读取创建 marker。 |

## 3. 并发设计原则

| 原则 | 实现约束 |
|---|---|
| operation namespace | 幂等唯一性为 `operation_name + normalized_key`；不同 operation 可复用同一原始 key。 |
| stable digest | digest 只覆盖改变业务结果的稳定输入；易变 transport metadata 必须排除。 |
| optimistic revision | 所有 mutable truth、projection、outbox、handoff、reference marker 更新都带 `HostRevision` expected value。 |
| business uniqueness | single-active host/session、同 generation effect、同 publication/handoff key 等用显式唯一约束或等价 Port 语义保护。 |
| local-first | attempt/cleanup/outbox 先在本地成功提交，再跨 Port 触发 external effect。 |
| unknown preservation | timeout/commit unknown 不更换 effect/publication/handoff key；原记录进入 `Unknown/Held/Gap`。 |
| append-only side effect | history、material、accepted trace 和 outbox 追加，不靠覆盖旧记录解决竞争。 |
| query no-write | query 不 reserve、mark stale、refresh、rebuild、repair、append history 或 publish。 |
| job no-authorization | scheduler/Job 只能推进已提交记录，不创建 intent、decision、recovery 或新 generation。 |
| missing sidecar no recompute | result/payload/material/history 缺失是 consistency defect，不能从 current truth 临时重建。 |

## 4. 并发资源与控制矩阵

| 资源 | 竞争者 | 控制方式 | 冲突处理 |
|---|---|---|---|
| `HostIntent` / decision current | Accept/Decide commands | idempotency + expected revision | `VersionConflict`，不覆盖新版本 |
| project-member current host pointer | Establish generation / close / recovery | single-active current pointer + generation fence | loser `Conflict/Held`，不生成第二 current |
| `HostQualificationContext` / assembly / readiness | resolve/coordinate commands、source consumer | object revision + same host/generation guard | stale/blocked；重新评估而非合并不同 generation |
| `HostActionAttempt` | prepare, dispatch job, outcome consumer | effect-key unique lookup + expected attempt revision | duplicate replay；unknown 保留原 key |
| external association | outcome consumer / close | target + generation + correlation matching | late/invalid/unknown，不写 current association |
| registration / endpoint / Host Session | registration/session commands、replacement | fingerprint/target uniqueness + replacement plan + expected revision | conflict/blocked；旧 session 不被静默覆盖 |
| health signal intake | signal consumer redelivery/out-of-order | source sequence/time/generation ordering + dedup key | duplicate/late/stale，不能直接改 healthy |
| assessment/failure/recovery | health job、recovery command | current record revision + explicit control basis | conflict/supersede；不隐式 recovery |
| closure / cleanup | close command、cleanup job、feedback consumer | closure causal key + cleanup effect key + revision | held/unknown/gap，不能换 key盲重放 |
| residual / reconciliation case | reconciliation reruns | case scope/cursor + expected revision | item conflict，追加 finding，不反写 source |
| material/history | accepted flow、feedback consumer | immutable ref + append-only relation | duplicate append由 operation replay抑制 |
| outbox record | dual publisher workers | outbox ref + expected marker revision | one winner；另一方 reload/skip |
| projection state/view | stale marker、rebuild workers、query | projection revision + committed source cursor | older cursor no-op；source不变 |
| handoff marker | submit/deliver/feedback jobs | target-specific handoff key + marker revision | per-layer conflict；不推导下一层 |
| stored result | concurrent completion | reservation ownership + same UoW save-before-complete | missing result => consistency defect |

## 5. Operation idempotency key matrix

### 5.1 Command

| Command | key 来源 | digest 必含 | duplicate surface |
|---|---|---|---|
| `AcceptHostIntentCommand` | command metadata | project/member refs、source ref、intent key、requested action、scope | stored command outcome/rejection |
| `DecideHostOrchestrationCommand` | command metadata | intent ref、decision key、current selector、decision input | stored command outcome/rejection |
| `ResolveHostQualificationCommand` | command metadata | decision/host/generation refs、required source set、environment ref | stored command outcome/rejection |
| `CoordinateHostAssemblyCommand` | command metadata | qualification ref、host/generation、required item set | stored command outcome/rejection |
| `AcceptHostRegistrationCommandPlaceholder` | command metadata | registration fingerprint、host/generation、safe source/credential refs | stored command outcome/rejection |
| `MaintainHostSessionCommandPlaceholder` | command metadata | registration/endpoint/generation refs、association input | stored command outcome/rejection |
| `DecideHostRecoveryCommand` | command metadata | host/generation、assessment/failure refs、recovery action/control basis | stored command outcome/rejection |
| `CloseHostCommand` | command metadata | host/generation、closure scope、causality refs、current session/association refs | stored command outcome/rejection |

### 5.2 Internal Command

| Internal command | key 来源 | 保护 |
|---|---|---|
| `EstablishHostGenerationCommand` | inherited operation context | current pointer expected revision + generation candidate uniqueness |
| `PrepareHostActionCommand` | inherited operation context | action decision ref + target refs + immutable `ExternalEffectKey` |

Internal 不等于无幂等。它们不能由 transport 直接调用，但必须经过 application context、actor/correlation、reservation（若 flow 需要）和 UoW。

### 5.3 Query

`QueryCurrentHostDecision`、`QueryHostAssemblyReadiness`、`QueryHostAccessSession`、`QueryHostHealthFailure`、`QuerySafeHostFacts`、`QueryHostHistory` 不带幂等 key。重复 Query 只重新执行授权读取，结果可能因 freshness/source revision变化而不同；不得把这种变化误判为 idempotency conflict。

### 5.4 Consumer 与 Job

| 入口 | key 来源 | digest 必含 | 结果回放 |
|---|---|---|---|
| `QualificationSourceChangedConsumerPlaceholder` | envelope dedup key | consumer name、source ref/version、safe snapshot refs、schema version | stored receipt |
| `HostActionOutcomeConsumerPlaceholder` | envelope dedup key | attempt/effect key、target ref、generation、outcome summary | stored receipt |
| `HostHealthSignalConsumerPlaceholder` | envelope dedup key | source signal ref、sequence、generation、captured time、safe summary digest | stored receipt |
| `HostCleanupFeedbackConsumerPlaceholder` | envelope dedup key | cleanup effect key、target、generation、outcome summary | stored receipt |
| `HostHandoffFeedbackConsumerPlaceholder` | envelope dedup key | handoff key、target、feedback layer、source feedback ref | stored receipt |
| `DispatchPendingHostActionsJob` | job envelope | selector、attempt refs、page、job kind | stored job report |
| `EvaluateDueHostHealthJob` | job envelope | scope、signal/host selectors、page、job kind | stored job report |
| `ProgressPendingHostCleanupJob` | job envelope | closure/cleanup selectors、page、job kind | stored job report |
| `ReconcileHostResidualsJob` | job envelope | scope、source cursor selector、page、job kind | stored job report |
| `PublishHostFactOutboxJob` | job envelope | outbox selector、target selector、page、job kind | stored job report |
| `RebuildSafeHostProjectionJob` | job envelope | projection selector、committed source selector、page、job kind | stored job report |
| `ReconcileHostHandoffGapsJob` | job envelope | target/handoff selector、page、job kind | stored job report |

Job `run_id`、requested_at 和 scheduler attempt 不进入 business digest；它们只标识本次 run。一个新 run 若要重试 failed item，必须使用明确的新的 job key 或由 job policy 定义的 stable rerun identity，不能覆盖已完成 run 的 stored report。

## 6. Digest 规范

### 6.1 必须包含

- operation name / consumer name / job kind；
- route-bound typed refs、project/member 双锚、host/generation、target、scope；
- command 的稳定 DTO 字段、显式 expected revision（若它改变语义）；
- event 的 source ref、schema version、source version/sequence、payload digest 和 safe snapshot refs；
- job 的 selector、page、target、policy/config ref（若输出受其影响）。

### 6.2 必须排除

`command_id`、`query_id`、`message_id`、`run_id`、trace/span id、requested/captured time、transport header、broker offset、delivery attempt、retry counter、随机生成的 local id、secret、endpoint、外部正文以及 adapter error text。

Digest 必须使用 deterministic field order 和稳定 enum variant 名称；`None`、空集合、缺失字段先经 DTO validation 归一化，不能由 hash 实现自行猜测。具体 hash 算法和保留期留给 Step 14/04，不在本步锁定产品。

## 7. Reservation 与 replay 算法

```text
entry validates metadata and computes RequestDigest
  -> reserve(operation_name, key, digest)
     -> Duplicate(result_ref): rollback current UoW, load exact stored surface, return replay
     -> InFlight: return Delayed/Unavailable, do not enter mutation
     -> Conflict: return IdempotencyConflict, do not mutate
     -> Reserved: execute one application flow
          -> save truth + sidecars/result in same required UoW
          -> complete reservation only after result ref is durable
          -> commit
```

`Duplicate` 的 stored kind 必须与入口一致：Command 只能回放 command outcome/rejection，Consumer 只能回放 receipt，Job 只能回放 job report。完成记录指向不存在或类型不匹配的 result 时，返回 `DuplicateResultMissing/ConsistencyDefect`，不得回查 current truth 重新生成。

## 8. 并发与重入场景

| 场景 | 预期行为 | 禁止行为 |
|---|---|---|
| command 客户端超时后并发重试 | 第二次 reserve 返回 in-flight/duplicate；原 key 保持不变 | 创建第二个 intent/decision/generation |
| 同 subject 两个 generation 同时建立 | current pointer 只有一个成功；另一方 conflict/held | 以时间戳或“最后写入”覆盖 current |
| dispatch job 双 worker | 读取同一 attempt revision；一个更新 `Dispatched`，另一方 version conflict后 reload | 两次调用 carrier |
| action feedback 重投 | 同 effect key + same digest 返回 duplicate；不同 digest rejected | 生成新的 effect key掩盖 unknown |
| old generation feedback 到达 | 记录 late/unknown/gap或history | 覆盖 current host/association |
| registration replacement 与 close 并发 | replacement plan 或 close 通过 expected revisions 竞争；失败方重读 | 静默关闭新 registration |
| health signal 乱序 | sequence/time/generation guard 标记 late/stale | 用旧 signal 写 current healthy/recovery |
| cleanup job 与 feedback 并发 | key/revision matching；unknown 保留原 cleanup key | cleanup 成功后再新建同一释放动作 |
| outbox 两个 publisher | marker expected revision 选出单一 winner | 两次提交同一不可逆 publication |
| projection 两个 rebuild | projection revision/cursor winner；旧 cursor不覆盖新状态 | 从 query 中顺便 rebuild |
| handoff feedback 与 retry 并发 | target-specific marker per layer；unknown 时先查 marker | 从 submitted 推导 accepted |
| job rerun | 同 key 回放；新 key 只选择未完成/明确 failed item | 扫描 current truth 重建已完成副作用 |

## 9. Commit unknown 与恢复顺序

当 `HostUnitOfWork.commit` 返回未知结果时，调用方必须按下列顺序处理：

1. 不发送补偿 mutation、不到 external Port 重放不可逆 effect；
2. 以原 `operation_name + idempotency_key` 查询 reservation 状态；
3. 若有 stored result，直接回放并把 surface 标记为 duplicate/recovered；
4. 若 reservation 未完成但 truth/result 可能已写入，进入 consistency/reconciliation，不猜测“未写入”；
5. 若确认整笔 rollback 且 effect 尚未触发，才允许同 key 重新执行；
6. 若无法确认，保持 `Unknown/Held`，由运维或显式 reconciliation 决定下一动作。

对于 dispatch、cleanup、publication、handoff，commit unknown 与 external call unknown 必须共享原 effect/publication/handoff key；不能用新 key 规避重复风险。

## 10. Outbox、Projection、Reference、Handoff 重入

### 10.1 Outbox

`HostOutboxRepository.list_pending_with_payload` 返回带 immutable payload 的 versioned item。publisher 先以 item version 申请/记录 submission，再依据 typed `HostSubmissionResult` 更新 marker。version conflict 只表示本 worker 未赢得更新，不等于 publish 未发生；必须 reload 后决定是否进入 unknown/reconciliation。

### 10.2 Projection

stale marker 与 rebuild 使用 `HostProjectionState` revision 及 committed source cursor。旧 cursor 只能 no-op；rebuild 失败保持 stale/degraded/unavailable，不能回写 source truth 或用 current query 结果补齐缺失 material。

### 10.3 Qualification/reference

source consumer 和 refresh job 使用 source key + source version/sequence + local revision。较旧 source result 不覆盖较新 snapshot；同一 source key 不同 digest 进入 conflict。refresh 只能写 safe snapshot、freshness、unresolved/invalid marker，不改变 orchestration/ready。

### 10.4 Handoff

每个 target 有独立 `HandoffKey` 和 marker revision；`submitted`、`delivered`、`observed`、`accepted` 是独立 feedback layer。重入只重试未确认层，不跳过或推导后续层。

## 11. Fake parity 与可测试切口

Fake 与 planned durable adapter 必须在以下行为上相同：expected revision 冲突、single-active/generation fence、same-key replay、different-digest conflict、in-flight reservation、rollback 不泄漏 cursor/result/outbox、unknown effect key 保留、forbidden body 拒绝、missing sidecar 报 consistency defect。Fake 通过不等于真实 store、broker、Runtime、Member、Images、Sandbox 或 delivery ready。

Step 16 至少承接以下测试切口（仅列设计切口，不表示已执行）：

- `same_key_same_digest_replays_stored_result`；
- `same_key_different_digest_returns_conflict`；
- `in_flight_reservation_blocks_second_writer`；
- `commit_unknown_requires_idempotency_lookup`；
- `generation_fence_rejects_late_feedback`；
- `dual_outbox_publishers_are_version_guarded`；
- `projection_old_cursor_cannot_overwrite_new_state`；
- `query_never_reserves_or_writes`；
- `missing_result_or_payload_is_not_reconstructed`。

## 12. 前序闭环与 blocker

| 审计项 | 结果 |
|---|---|
| Step 7 Port 有 reserve/complete、expected revision、marker version 接缝 | pass_with_upstream_blockers |
| Step 8 command/consumer/job metadata 可形成 digest | pass_with_upstream_blockers |
| Step 9 flow 的 reserve→write→result→complete 顺序 | pass |
| Step 10 generation/effect/publication/handoff 状态与 fence一致 | pass |
| Step 11 UoW、rollback、outbox snapshot、cursor隔离 | pass |
| Step 12 error/recovery 与 conflict/unknown 映射 | pass |
| Runtime/Member/Images/Sandbox/Core/Bus exact contract | pending / blocked / fail-closed |
| cursor exact type、lease/lock产品和数值 | pending |
| 正式 `03-详细设计.md` | forbidden until Step 19 |

## 13. 回填草稿与 Step 14 handoff

正式 `03` 第 12 章只装配：optimistic revision、single-active/generation fence、operation namespace、digest inclusion/exclusion、reservation/replay、in-flight、commit unknown、unknown key preservation、outbox/projection/reference/handoff 重入规则。具体 key matrix 与场景表以本文件为详细入口；Step 14 继续定义配置引用和 adapter 绑定，不改变本步并发语义。

```text
step_13_status = completed
step_13_gate = pass_with_upstream_blockers
next_allowed_step = Step 14 config_dependencies
formal_03_write_allowed = false_until_step_19
```
