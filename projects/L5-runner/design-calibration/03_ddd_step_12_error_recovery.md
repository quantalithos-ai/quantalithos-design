# Step 12. 错误模型、异常分支与恢复口径

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12
> 书写规范：`standards/document/详细设计书写规范.md` §5.11
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md`
> 回填位置：未来正式 `03-详细设计.md` §11
> 状态：`completed_with_upstream_blockers`

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| current_step | Step 12 |
| current_module | `error_recovery:error_taxonomy_and_recovery_mapping` |
| gate_status | `pass_for_step_13` |
| inputs | Step 6 errors/reasons、Step 8 public issue surface、Step 9 flow failures、Step 11 transaction failures |
| implementation_status | `not_started` |
| formal_03_write_allowed | `false_until_step_19` |
| next_allowed_action | 创建 Step 13 并发/幂等/重入中间产物 |

本步定义 typed error taxonomy、协议映射、异常分支和恢复边界；不选择 HTTP/RPC transport、重试次数、DLQ 产品、日志 backend 或实现语言。

## 2. 错误分层原则

1. Domain 错误表达对象不变量、非法状态和 binding/basis 不成立；不携带 raw external body。
2. Application 错误表达编排、repository、UoW、stored-result、projection 或 consistency 缺陷；不能伪装成 owner rejection。
3. Port/infra 错误表达 readiness、unavailable、unsupported、timeout、corruption 和 adapter contract；必须保留 safe issue ref。
4. Protocol/entry/worker/job surface 只暴露有限、可序列化、body-free 的 `Rejected/Conflict/Blocked/Unknown/UnsupportedVersion/Duplicate` 等结果。
5. `Unknown` 表示 effect 或 commit 不能确认，不等同 Failed；必须关联 `RecoveryCase` 或只读 readback。
6. `Blocked` 表示安全前置不能证明，不等同 partial work；不得调用危险 side effect。
7. 错误字符串、HTTP code、ACK、PID、socket、连接恢复和本地重试计数都不能单独决定业务状态。

## 3. 错误类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `DomainError::InvalidStateTransition` | domain | 不允许的 state/method 调用 | 否；需新 identity 或正式恢复流 | `Rejected` 或 application invalid-state issue |
| `DomainError::BindingMismatch` | domain | selection/material/generation/basis 不一致 | 仅在重新读取新 basis 后重试 | `Conflict` / `StaleBasis` |
| `DomainError::SafetyBlocked` | domain/resource | protection 输入缺失、stale、conflict | 否；等待正式输入 | `Blocked(SafetyBlocked)` |
| `ApplicationError::Validation` | entry/application | DTO、metadata、one-of、范围不合法 | 否 | entry `Rejected` |
| `ApplicationError::VisibilityDenied` | application/query | actor/scope 无权查看 | 否；权限变化后重新查询 | restricted body-free surface |
| `ApplicationError::VersionConflict` | repository/application | expected version/generation 不匹配 | 读取当前版本后显式重试 | `Conflict` |
| `ApplicationError::RepositoryContractViolation` | application/infra | required index/ref/body/schema 缺失 | 否；暂停并修复契约 | `ApplicationError` / consistency unknown |
| `ApplicationError::StoredResultMissing` | result/idempotency | Completed record 无完整 stored result | 否；只允许本地修复/readback | `Unknown` + `RecoveryCase` |
| `ApplicationError::ProjectionContractViolation` | projection | subject/section/generation/ref 不一致 | 只可显式 refresh 当前 generation | `Blocked`/`Conflict` |
| `PortError::Unavailable` | adapter | formal dependency unavailable | 由 flow 定义 safe bounded retry；不得盲重放 effect | `Blocked` 或 `Unknown`（若 effect 已发出） |
| `PortError::Unsupported` | adapter | schema/version/capability 不支持 | 否，等待合同升级 | `UnsupportedVersion`/`Blocked` |
| `PortError::Timeout` | adapter | 调用超时且 effect 不可判定 | 不自动重放 | `Unknown` + recovery |
| `PortError::Rejected` | owner adapter | formal owner rejection | 否；新 intent 才能重试 | typed `Rejected` |
| `PortError::Conflict` | owner/read adapter | owner basis/lease/version conflict | 重新读取 basis 后新 intent | `Conflict` |
| `PortError::RedactionBlocked` | diagnostic/redaction | 无法安全生成 bounded content | 否；人工/后续合同处理 | `Blocked`，value=None |
| `WorkerError::PositiveConsumerContractNotAuthorized` | worker | positive Consumer path 当前未授权 | 否；保持 blocked | body-free `Blocked` |
| `WorkerError::MalformedHeader` | worker | source/schema/dedup header 缺失或冲突 | 否 | `Rejected` |
| `JobError::ClaimConflict` | operations | local claim 已被其他 worker 占用 | 否；不 reclaim | `Conflict`/`Unknown` |
| `JobError::CheckpointUnknown` | operations | checkpoint read/commit 不确定 | 否；只读恢复 | `Unknown` + recovery |
| `InfraError::NotReady` | builder/availability | required local capability 未 Ready | 否；新 build/config 后重试 | `Blocked` |
| `InfraError::CorruptStore` | local store | durability/atomicity/index/corruption 不可证明 | 否；停止危险操作 | `ApplicationError`/blocked readiness |

## 4. 错误映射表

| 内部错误 | Command | Query | Consumer | Job | 调用方处理 |
|---|---|---|---|---|---|
| validation / malformed | `Rejected(InvalidInput)` | body-free rejected | `Rejected` | `Rejected` before claim | 修正输入，不重试同 key |
| visibility denied | `Rejected/Restricted` | `Restricted` with no body | `Rejected` | blocked item | 不泄露 existence/body |
| stale/basis/version conflict | `Conflict` | stale/conflict marker | `Rejected/Blocked` | conflict item/report | reread exact basis；不覆盖 |
| dependency unavailable | `Blocked` | degraded/unavailable | body-free `Blocked` | `Blocked` report | 等待依赖；不得 private fallback |
| unsupported contract | `UnsupportedVersion`/`Blocked` | unsupported surface | `UnsupportedVersion` | `Blocked` | 等合同升级 |
| explicit owner rejection | typed `Rejected` | safe rejected posture | planned only | typed item failure | 不把 rejection 当 success |
| ambiguous external effect | `Unknown` + recovery ref | `Unknown` view | `Unknown` if receipt ambiguous | `Unknown` report | 只做 read-only reconcile |
| local commit/store defect | `ApplicationError` or consistency unknown | application error/degraded | consistency error | unknown report | 暂停；不得 rerun |
| duplicate complete result | `Accepted(replay=DuplicateReplayed)` | n/a | `Duplicate` | duplicate report replay | 直接读完整 stored surface |

## 5. 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| entry metadata/union invalid | entry validation | `Rejected`；不 reserve、不写 repository、不调用 port | local safe trace/metric only；无 event |
| domain illegal transition | domain method | rollback candidate UoW；typed invalid-state result | local rejection marker；非 formal audit |
| expected version/generation mismatch | repository save | reject overwrite；return Conflict | local metric/trace；无 owner write |
| authority/material read unavailable | adapter result | selection/task blocked or stale；不补历史 cache | safe issue/metric；无 outbound event |
| Sandbox/Runtime call timeout | port boundary | if effect uncertain, local `Unknown + RecoveryCase`; no resend | safe trace correlation；不写 evidence |
| owner explicit reject | adapter mapping | persist local rejected intent/result where intent existed | safe local record；不升级 projection |
| stored result missing | duplicate gate | consistency unknown; open/associate recovery | local defect marker；不重跑 |
| consumer readiness blocked | header-first worker | body-free Blocked; no payload decode/hash/store/ACK | worker metric/trace；无 event |
| consumer header malformed | header inspection | Rejected; no receipt replay | safe issue; no payload retention |
| job claim conflict | operations entry | no claim takeover; report Conflict/Unknown per read certainty | local job marker；no owner mutation |
| checkpoint read/commit unknown | job boundary | freeze job/report Unknown; RecoveryCase | local recovery trace；no auto resume |
| redaction blocked | diagnostic flow | save no visible content; diagnosis Uncertain/Blocked | safe redaction metric；no raw log |
| projection generation conflict | J05 repository | keep current section; report Conflict/Partial/Blocked | metric/trace; no source mutation |

## 6. 恢复口径表

| 场景 | 恢复状态 | 允许动作 | 禁止动作 |
|---|---|---|---|
| local version conflict | unchanged current record | reread + explicit new basis | blind overwrite |
| external effect unknown | `Unknown` + open `RecoveryCase` | formal read-only reconcile | resend/reclaim/replay |
| owner read unavailable | case remains `Frozen/ManualReview` | retry safe read under new attempt when authorized | infer rejection/success |
| stale selection/material | `Stale/Blocked` | explicit reselect/reacquire/new generation | auto promote/run |
| control conflict/unknown | `Conflict/Unknown` | same-kind readback; new control only after closure | repeat old control |
| projection stale/failure | section stale/degraded | J05 explicit refresh with existing identity | Query refresh or create identity |
| missing duplicate result | `Unknown` consistency case | repair local result store | rerun original operation |
| claim/checkpoint unknown | job frozen/Unknown | operator/reconcile review | automatic reclaim/resume |
| redaction failure | preview unavailable/diagnosis uncertain | later bounded safe read | raw stdout/stderr/file fallback |
| local store corrupt/not ready | facade blocked | infrastructure repair/new builder | in-memory/file fallback |

## 7. Public issue taxonomy

`RunnerProtocolIssueKind` 仍使用 Step 8 的有限集合：`InvalidInput`、`MissingRequiredField`、`VisibilityDenied`、`StaleBasis`、`AuthorityBlocked`、`UnsupportedContract`、`DependencyUnavailable`、`IdempotencyConflict`、`VersionConflict`、`SafetyBlocked`、`ConsistencyUnknown`。Step 12 不新增 public variant；内部错误通过 typed mapper 映射到这些 surface。`Unknown` 必须携带 `RecoveryCaseId`，`Conflict` 可以携带 recovery ref，`Blocked` 必须携带 bounded issue ref。

## 8. Dead-letter / delayed / rejected 语义

- 当前 planned Consumer 不进入 positive apply，因此不产生可重放 payload dead-letter；只能保存 header-only rejected/blocked/quarantine marker（若未来 isolation port 合同闭合）。
- `Delayed`、`GapDetected`、`Accepted`、`Quarantined` 仅是 reserved/future shape，不能被当前 readiness 映射成 Running 或 applied。
- Job `Blocked` 是可信 terminal local disposition，不压成 `Partial/Failed`；`Unknown` 必须保留 case；`DuplicateReplayed` 只来自完整 stored report。
- 不定义具体 broker/DLQ/topic/retention 产品。

## 9. 错误与状态闭环审计

| 审计项 | 结论 | 依据 / blocker |
|---|---|---|
| 每个 Step 10 illegal transition 有错误映射 | pass | Domain/Application invalid-state + typed public surface |
| Unknown 与 RecoveryCase 配对 | pass | Step 9/10/11；不自动 replay |
| Blocked 与不可证明前置区分 | pass | readiness/safety/owner boundary |
| Query error no-write | pass | Step 9 §8、Step 11 §8.2 |
| duplicate result missing | pass | consistency unknown；不重跑 |
| consumer negative path | pass | header-first body-free |
| exact adapter error/code mapping | blocked | `RUN-UP-008` |
| production retry/DLQ policy | blocked | transport/ops authority 未闭合 |

## 10. Step 13 handoff

Step 13 必须以本步错误分类作为并发/幂等测试和重入保护的输入：version conflict、reservation crash、terminal commit unknown、external timeout、claim/checkpoint ambiguity、projection generation conflict、duplicate result missing。任何重试策略都不得突破本步的 no-replay/no-resend/no-reclaim 边界。

## 11. Step 12 完成条件与停审

| 条件 | 结论 |
|---|---|
| 错误类型表 | completed |
| Command/Query/Consumer/Job 映射 | completed |
| 异常分支处理表 | completed |
| 恢复口径表 | completed |
| Unknown/Blocked/Conflict 语义 | completed |
| exact SDK/transport/DLQ mapping | blocked and explicitly pending |
| Step 13 gate | `pass_for_step_13` |

Step 12 完成。本文不证明错误处理代码、adapter、测试或生产恢复链路已实现。
