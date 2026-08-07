# 06 验收标准校准 · Step 7 接口、事件与跨仓同步

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 7
- 回填章节：正式 `06-验收标准.md` §7

### 1.1 Step 内计划

- [x] 读取输入：Step 6、正式 00 §6/§12、03 §7/§15.3~§15.6、05 §6.3~§6.5/§9/§13、全局依赖规则
- [x] 固定协议库存：13 Command、11 Query、5 Consumer、4 outbound Event、4 Job
- [x] 回答 SOP 问题并诊断旧 06
- [x] 逐项写 protocol gate：正式 logical schema、pass/fail、concrete TC、candidate slot、suite/report、依赖类型
- [x] 完成 37/37 单项停审、三类依赖映射和未就绪裁决
- [x] 完成跨接口同步审计、回填草稿与 Step 自检

## 2. 本步输入

| 输入 | 本步固定事实 |
|---|---|
| `03-详细设计.md` §7/§8/§15.3~§15.6 | `CF-01~13`、`QF-01~11`、`IF-01~05`、`OF-01~04`、`JF-01~04` 是唯一正式 logical protocol inventory；物理 endpoint/topic/group/cron 不在本仓协议中 |
| `05-测试方案.md` §6.3~§6.5 | 只引用已定义的 concrete `TC-L2T-*`；`CF/QF/IF/OF/JF` 是 flow ID，不是测试用例 ID |
| `05` §9/§13 | raw 固定在 `artifacts/test/<run_id>/suites/<suite>/`，human report 固定在 `reports/runs/<run_id>/suites/<suite>.md`；`EV-CAND-*` 只是 planned slot |
| `00` §6/§12、`01` §8 | compile 仅 `L0-core`；Hub/Sandbox/Runtime 是 runtime；Bus/Observability 是 event；authorization owner pending、SDK future/excluded |
| Step 6 | dependency type、owner、no reverse-write、body-free 和 P1 isolation 已成为 P0 红线 |

## 3. SOP 问题回答

1. **每个 P0 Command / Query 如何验收？**

   Command 逐项验证 closed schema、metadata/body 分离、canonical digest、named flow/UoW/Port、typed response/error、same-digest exact replay 和失败副作用；Query 逐项验证 owner-first visibility、正式 surface/freshness/watermark、named read seam，并对 `UoW begin/write/refresh/repair/external Port=0` 作共同断言。

2. **每个 P0 Event 如何证明可消费 / 可重放？**

   当前 P0 证明的是 transport-neutral `ToolEventEnvelope<Payload>` 可由已提交 `SafeHandoffMaterial` 确定性构造、source refs 对称、Prepared 后最多一次 collaboration call、duplicate/Prepared/unknown 返回本地 stored attempt。物理 Bus publish/replay/delivery 由 owner 证明；其未闭口不能被本地 fake 冒充，也不使 local semantic contract 失败。

3. **每个 P0 Job 如何证明幂等和恢复？**

   每个 Job 固定非空 bounded scope/cursor/watermark/limit，same key/digest 回放 exact `JobReport`，mixed target 保留 committed refs 和 `Partial/Blocked/Failed`，不得全扫、修 core truth、创建 scheduler run 或 evidence。

4. **跨仓同步成功标准是什么？**

   成功分两层：本地 P0 seam closure 要求 typed ref/safe snapshot/material、依赖方向、blocked-aware mapping、one-call/no-reverse-write 成立；external positive qualification 只有 owner contract、profile、scope manifest 和独立真实证据均闭合时才可判定。下游 delivery/Observed/run/readiness 不是 L2 local success。

5. **下游未就绪时如何验接缝？**

   仍必须通过 local/negative/blocked-aware tests；positive item 标为 `blocked_dependency` 或 `conditional_not_in_current_p0`，不得减少 P0 denominator，也不得要求下游完整实现。若未就绪却写成 ready/delivered/executed，则为 P0 failure/VETO。

6. **依赖与证据如何对应？**

   compile 验 contract compile/package scan；runtime 验 Port/adapter/fake parity、typed blocked mapping，禁止 sibling source dependency；event 验 semantic envelope/material/attempt/replay 和 status independence。pending/future 是关系状态，不是第四种依赖类型。

7. **物理 surface 是否固定？**

   否。当前只固定 logical schema。不得补造 HTTP/RPC endpoint、broker topic/route/group/DLQ、scheduler/cron/lease 或 SDK client；缺少物理绑定不构成本地协议失败，但谎报其存在触发红线。

## 4. 当前文档问题诊断

| 旧 06 问题 | 影响 | 本步修正 |
|---|---|---|
| 使用 `RegisterToolDefinition`、`ValidateToolInvocation`、`InvokeTool` 等历史 API | 与 37 个正式协议不一致 | 整体替换为 `CF/QF/IF/OF/JF` inventory |
| 把 host callback、policy trace、member-service 当验收主语 | 吸收 Sandbox/governance/runtime truth | 只验正式 L2 seam 和 owner-preserving handoff |
| 没有 logical/physical surface 区分 | 容易虚构 endpoint/topic/cron | 只写 logical schema，物理绑定保持 excluded/pending |
| “同步基本正常”且无 concrete TC/report | 无法复验 | 每项固定 concrete TC、slot、suite/raw/report 和失败影响 |
| 下游未就绪等同整体失败或被 fake 伪装通过 | P0 与 P1 污染 | local/negative P0 与 external positive qualification 分层 |

## 5. 改动前后与裁决取舍

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 协议分母 | 12 个历史功能名 | 37 个正式 logical protocol | 与 03/05 同名同分母 |
| Event 成功 | 默认等于 delivered | local attempt 与 delivery/observation 独立 | L2 不拥有 Bus/Obs truth |
| Consumer receipt | 暗含 broker ack | 只允许正式 `ConsumerReceipt` disposition | topic/group/ack/DLQ 非 L2 schema |
| Job | “后台任务正常” | bounded input、exact report replay、no-repair | 可实现、可复验 |
| 外部验收 | 要求下游完整联调 | 按依赖类型验 seam；positive 条件化 | 不越过本轮范围 |

采用“37 个 subordinate protocol gate + 需求 AC 映射”的方案。`PG-L2T-*` 只定位 §7 协议检查，不形成第二套需求验收分母；总体需求仍只使用 `AC-L2T-001~039`。

## 6. 结构化中间产物

### 6.1 公共协议与证据 oracle

```text
protocol_gate_pass :=
  formal logical schema and closed version are used
  AND mapped concrete TC belongs to its owning suite in the same fixed release run
  AND raw case/suite artifact and human suite report are paired
  AND mapped candidate slot receives final eligibility only from matching passed release seal
  AND positive, negative, duplicate and applicable phase/unknown assertions hold
  AND no dependency, owner, physical-surface or downstream-readiness inference occurs
```

下表中的 candidate slot 不是 evidence instance；所有 raw path 统一以 `artifacts/test/<run_id>/suites/<suite>/` 为根，report 统一为 `reports/runs/<run_id>/suites/<suite>.md`。实际裁决还必须满足 Step 3/10 的 matching release seal 与 projection manifest，不得只看 suite report 或 `evidence-index.json`。

### 6.2 Command protocol gates

| Gate / protocol / logical schema | Through condition | Failure condition | Concrete TC / candidate slot | Owning suite / report | AC / dependency disposition |
|---|---|---|---|---|---|
| `PG-L2T-CF-01` `EstablishToolContract`; `tools.command.establish_tool_contract.v1` | identity/current definition/evolution/stored result 同 UoW，same digest exact replay | unresolved authority 仍造 truth、第二 identity/fact、body 入库 | `TC-L2T-CONTRACT-001~002`; `EV-CAND-L2T-CONTRACT-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-001/006/007`; Core compile authority positive conditional |
| `PG-L2T-CF-02` `AssessToolDefinitionChange`; `tools.command.assess_tool_definition_change.v1` | body-free Candidate + impact，current 不变 | candidate 自动 current、冲突 source 被接受 | `TC-L2T-CONTRACT-003`; `EV-CAND-L2T-CONTRACT-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-006~007`; Core authority conditional |
| `PG-L2T-CF-03` `AdoptToolDefinitionRevision`; `tools.command.adopt_tool_definition_revision.v1` | compatible candidate、closure、CAS 后单次切换，旧版 `Superseded` | incompatible/closure/CAS failure 仍半写或改 anchor | `TC-L2T-CONTRACT-004`; `EV-CAND-L2T-CONTRACT-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-007~008/024`; local P0 |
| `PG-L2T-CF-04` `RetireToolContract`; `tools.command.retire_tool_contract.v1` | `Active -> RetirementPending -> Retired` 且历史保留 | 缺 closure 完成退役、删除/复活、继续受理 | `TC-L2T-CONTRACT-005/008`; `EV-CAND-L2T-CONTRACT-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-008/024`; local P0 |
| `PG-L2T-CF-05` `DeclareCapabilityBinding`; `tools.command.declare_capability_binding.v1` | ExplicitUnbound 零 Hub call；Bound 仅从对称 typed snapshot 建 relation/assessment/fact | 本地 registry/name fallback、Hub blocked 仍建 relation | `TC-L2T-BIND-001~002`; `EV-CAND-L2T-BIND-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-009~011`; Hub runtime positive conditional |
| `PG-L2T-CF-06` `ReplaceCapabilityBinding`; `tools.command.replace_capability_binding.v1` | CAS + distinct successor，旧 relation `Replaced`，唯一 current | two-current、null inference、blocked half replacement | `TC-L2T-BIND-003`; `EV-CAND-L2T-BIND-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-009~011/024`; Hub runtime positive conditional |
| `PG-L2T-CF-07` `InvalidateCapabilityBinding`; `tools.command.invalidate_capability_binding.v1` | typed reason/CAS 后 `Invalidated`，history retained | delete/restore/Hub repair/anchor rewrite | `TC-L2T-BIND-004`; `EV-CAND-L2T-BIND-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-009~011/024`; local P0 |
| `PG-L2T-CF-08` `SubmitToolInvocation`; `tools.command.submit_tool_invocation.v1` | canonical invocation/anchor/admission immutable；deterministic no-execution pair 原子 | raw caller/action 成 truth、external call、rejected 写 executed | `TC-L2T-INV-001~005/008`; `EV-CAND-L2T-INV-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-003/012~014`; Runtime consumption seam, no source dependency |
| `PG-L2T-CF-09` `EvaluateExecutionPreconditions`; `tools.command.evaluate_execution_preconditions.v1` | requirement 与 auth/readiness assessment 分离，缺失/deny/stale/conflict fail closed | self-auth/default allow、late clue 改旧 admission | `TC-L2T-PRE-001~005/010`; `EV-CAND-L2T-PRE-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-015~017`; auth pending、Sandbox runtime positive blocked |
| `PG-L2T-CF-10` `PrepareExecutionHandoff`; `tools.command.prepare_execution_handoff.v1` | phase-1 `Prepared` commit 后最多一次 Sandbox call，phase-2 local disposition | host fallback、Prepared=run/accepted、unknown 自动重调 | `TC-L2T-PRE-006~009`; `EV-CAND-L2T-PRE-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-017~018/024`; Sandbox runtime positive blocked |
| `PG-L2T-CF-11` `AcceptExecutionSource`; `tools.command.accept_execution_source.v1` | attributable safe source 形成唯一 outcome/audit pair；不充分 source 只 assessment/gap | raw capture/provider response=outcome、half pair、terminal overwrite | `TC-L2T-OUTCOME-001~006/010`; `EV-CAND-L2T-OUTCOME-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-019~021/024`; Sandbox source positive blocked |
| `PG-L2T-CF-12` `PrepareSafeExternalHandoff`; `tools.command.prepare_safe_external_handoff.v1` | minimal/body-free/redacted/correlated 四门全真才有 immutable material | 任一门失败仍 material/Port；local attempt=delivery/Observed | `TC-L2T-HANDOFF-001~002/007`; `EV-CAND-L2T-HANDOFF-001` | `application-core`; `reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-005/022/029`; event positive conditional |
| `PG-L2T-CF-13` `RecordConsistencyGapResolution`; `tools.command.record_consistency_gap_resolution.v1` | formal owner reread + CAS 后 `ResolutionPending -> Resolved/Superseded` | 仅凭 clue/body/signoff 修 subject truth 或 terminal gap | `TC-L2T-STATE-007`,`TC-L2T-ERR-012`; `EV-CAND-L2T-STATE-001`,`EV-CAND-L2T-ERR-001` | `contract-domain`,`transaction-concurrency`; `reports/runs/<run_id>/suites/contract-domain.md`,`reports/runs/<run_id>/suites/transaction-concurrency.md` | `AC-L2T-024~025/031`; owner seam conditional |

### 6.3 Query protocol gates

所有行共同失败条件还包括任何 write UoW、idempotency mutation、external Port、refresh/rebuild/repair 或从不可见对象泄露存在性。

| Gate / protocol / logical schema | Through condition / explicit degraded surface | Concrete TC / slot | Suite / report | AC / disposition |
|---|---|---|---|---|
| `PG-L2T-QF-01` `GetToolContract`; `tools.query.get_tool_contract.v1` | current/history bundle 对称；`Found/NotFound/NotVisible/Stale/Unavailable` 分型 | `TC-L2T-QUERY-001`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-001/006/023/025`; P0 |
| `PG-L2T-QF-02` `CompareToolDefinitionRevisions`; `tools.query.compare_tool_definition_revisions.v1` | directed diff；missing/mismatch/unverifiable 分型，不 adopt/rebuild | `TC-L2T-QUERY-002`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-006~007/023/025`; P0 |
| `PG-L2T-QF-03` `GetCapabilityBinding`; `tools.query.get_capability_binding.v1` | selector/snapshot/assessment/gap 对称；ExplicitUnbound 显式；two-current integrity failure | `TC-L2T-QUERY-003`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-009~011/023/025`; P0 local |
| `PG-L2T-QF-04` `GetToolInvocation`; `tools.query.get_tool_invocation.v1` | invocation/admission/anchor 可见；无 outcome 时 `None`，不从 Runtime/Sandbox 推断 | `TC-L2T-QUERY-004`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-003/012~014/023`; P0 |
| `PG-L2T-QF-05` `GetExecutionPreconditionView`; `tools.query.get_execution_precondition_view.v1` | requirement/assessment/handoff/attempt 同 watermark；未评估/blocked/unknown 显式 | `TC-L2T-QUERY-005`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-015~018/023`; P0 negative |
| `PG-L2T-QF-06` `GetOutcomeAudit`; `tools.query.get_outcome_audit.v1` | atomic pair Found；half pair integrity failure；external status optional/independent | `TC-L2T-QUERY-006`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-019~022/023`; P0 |
| `PG-L2T-QF-07` `GetReferenceConsistencyReport`; `tools.query.get_reference_consistency_report.v1` | bounded report 的 `Current/Partial/Stale/Failed/Rebuilding/Unavailable/Empty` 分型 | `TC-L2T-QUERY-007`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-023/025/031`; peripheral implementation optional, purity P0 |
| `PG-L2T-QF-08` `SearchToolContracts`; `tools.query.search_tool_contracts.v1` | stable order/cursor digest；freshness 和 invalid cursor 显式 | `TC-L2T-QUERY-008`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-023/025`; implementation P2, isolation P0 |
| `PG-L2T-QF-09` `CompareToolContracts`; `tools.query.compare_tool_contracts.v1` | stored projection only；Fresh/Stale/Unavailable 分型，不 fallback QF-02 | `TC-L2T-QUERY-009`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-023/025`; implementation P2, isolation P0 |
| `PG-L2T-QF-10` `GetToolDiagnostic`; `tools.query.get_tool_diagnostic.v1` | safe local summary；unknown/partial/degraded 显式，不等 health/recovery | `TC-L2T-QUERY-010`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-023/025/031`; implementation P2, isolation P0 |
| `PG-L2T-QF-11` `GetToolConsumerGuidance`; `tools.query.get_tool_consumer_guidance.v1` | revision-bound read-only guidance；不生成 SDK/plan/auth/Sandbox decision | `TC-L2T-QUERY-011`; `EV-CAND-L2T-QUERY-001` | `query-purity`; `reports/runs/<run_id>/suites/query-purity.md` | `AC-L2T-023/025`; SDK future/excluded |

### 6.4 Inbound Consumer protocol gates

所有 Consumer 都必须先验证 `InboundEventEnvelope<T>` 的 version/source/correlation/body，提交 consumer claim 后才允许一次 observational Port 或正式 Command re-entry；duplicate 只回放 `ConsumerReceipt`。logical schema 不拥有 topic/group/ack/DLQ。

| Gate / protocol / logical schema | Through condition | Failure condition | Concrete TC / candidate slot | Suite / fixed report | AC / dependency disposition |
|---|---|---|---|---|---|
| `PG-L2T-IF-01` `ConsumeHubCapabilityChangeClue`; `tools.inbound.consume_hub_capability_change_clue.v1` | supported clue 只追加 snapshot/assessment/gap/receipt；bounded page；duplicate 零 Port/page/write | clue 改 Binding、source/version/body 冲突仍 accepted、receipt 冒充 ack | `TC-L2T-CONSUMER-001`; `EV-CAND-L2T-CONSUMER-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-010~011/029`; Hub runtime positive conditional |
| `PG-L2T-IF-02` `ConsumeAuthorizationResultChangeClue`; `tools.inbound.consume_authorization_result_change_clue.v1` | invocation-bound result 只形成 consumption assessment/gap/receipt；unverifiable fail closed | 生成 effective authorization、default allow、owner/schema/revision mismatch 不 quarantine | `TC-L2T-CONSUMER-002`; `EV-CAND-L2T-CONSUMER-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-016/029`; owner pending，positive blocked |
| `PG-L2T-IF-03` `ConsumeSandboxExecutionSource`; `tools.inbound.consume_sandbox_execution_source.v1` | 唯一允许按 deterministic key 正式重入 `CF-11`；redelivery exact replay | Consumer 直写 outcome/audit、altered digest、第二 key/第二 effect、fabricated source | `TC-L2T-CONSUMER-003`; `EV-CAND-L2T-CONSUMER-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-018~021/029`; Sandbox runtime positive blocked |
| `PG-L2T-IF-04` `ConsumeBusDeliveryStatusFeedback`; `tools.inbound.consume_bus_delivery_status_feedback.v1` | 只追加 `BusDeliveryStatusRef`/gap/receipt；attempt/outcome 不变 | status 写成 Delivered truth、unknown/route blocked 覆盖 local attempt | `TC-L2T-CONSUMER-004`; `EV-CAND-L2T-CONSUMER-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-021~022/029`; Bus event positive conditional |
| `PG-L2T-IF-05` `ConsumeObservationStatusFeedback`; `tools.inbound.consume_observation_status_feedback.v1` | observation status/ref 与 Bus 独立，只追加 ref/gap/receipt | 写 Observed、创建 Observability store、producer/route blocker 被吞掉 | `TC-L2T-CONSUMER-005`; `EV-CAND-L2T-CONSUMER-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-021~022/029`; Observability event positive blocked |

### 6.5 Outbound semantic Event protocol gates

Event “可消费 / 可重放”的本轮 P0 含义是 logical envelope、material/source symmetry、deterministic event/attempt identity 和 local replay surface 成立，不是物理 route 已投递。所有 event 共同要求 `committed material -> pure map -> Prepared -> at most one collaboration call -> phase-2 local disposition`。

| Gate / protocol / logical schema | Through condition | Failure condition | Concrete TC / candidate slot | Suite / fixed report | AC / dependency disposition |
|---|---|---|---|---|---|
| `PG-L2T-OF-01` `ToolContractChanged`; `tools.event.tool_contract_changed.v1` | 只从 `ToolContractEvolutionFact` material 构造 envelope；duplicate/Prepared/unknown 零二次 call | 从 mutable current/full definition 构造、携带 route/delivery、写 Delivered | `TC-L2T-CONT-001`,`TC-L2T-HANDOFF-003`; `EV-CAND-L2T-CONT-001`,`EV-CAND-L2T-HANDOFF-001` | `entry-worker-job`,`application-core`; `reports/runs/<run_id>/suites/entry-worker-job.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-005/022/029`; Bus/Obs event positive conditional |
| `PG-L2T-OF-02` `CapabilityBindingChanged`; `tools.event.capability_binding_changed.v1` | FormalChange/ConsistencyGap branch exclusive，source/target/successor 对称 | event 改 Binding、branch/mismatch 仍提交、unknown 重调 | `TC-L2T-CONT-002`,`TC-L2T-HANDOFF-004`; `EV-CAND-L2T-CONT-001`,`EV-CAND-L2T-HANDOFF-001` | `entry-worker-job`,`application-core`; `reports/runs/<run_id>/suites/entry-worker-job.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-005/022/029`; event positive conditional |
| `PG-L2T-OF-03` `ToolOutcomeAuditMaterialAvailable`; `tools.event.tool_outcome_audit_material_available.v1` | 只引用不可拆 outcome/audit pair 与 safe refs；不带 result/error/audit body | half pair/body 仍建 attempt、local disposition=Observed/delivered | `TC-L2T-CONT-003`,`TC-L2T-HANDOFF-005`; `EV-CAND-L2T-CONT-001`,`EV-CAND-L2T-HANDOFF-001` | `entry-worker-job`,`application-core`; `reports/runs/<run_id>/suites/entry-worker-job.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-005/021~022/029`; event positive conditional |
| `PG-L2T-OF-04` `ToolConsistencyGapChanged`; `tools.event.tool_consistency_gap_changed.v1` | 只从合法 gap transition material 构造；attempt/gap refs 可重放 | event resolve/reopen gap、生成 evidence/signoff/route、unknown 重调 | `TC-L2T-CONT-004`,`TC-L2T-HANDOFF-006`; `EV-CAND-L2T-CONT-001`,`EV-CAND-L2T-HANDOFF-001` | `entry-worker-job`,`application-core`; `reports/runs/<run_id>/suites/entry-worker-job.md`,`reports/runs/<run_id>/suites/application-core.md` | `AC-L2T-005/022/029`; event positive conditional |

### 6.6 Operations Job protocol gates

| Gate / protocol / logical schema | Through condition | Failure condition | Concrete TC / candidate slot | Suite / fixed report | AC / dependency disposition |
|---|---|---|---|---|---|
| `PG-L2T-JF-01` `CheckCapabilityBindingConsistency`; `tools.job.check_capability_binding_consistency.v1` | non-empty bounded tool scope；Bound 才调 Hub；per-target assessment/gap + exact report replay | 隐式全扫、ExplicitUnbound 调 Hub、修 relation、partial 丢成功 refs | `TC-L2T-JOB-001`; `EV-CAND-L2T-JOB-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-023/025/031`; Hub runtime positive conditional |
| `PG-L2T-JF-02` `CheckReferenceIntegrity`; `tools.job.check_reference_integrity.v1` | bounded typed targets；named owner seam；Unverifiable/Blocked 保留 ref/gap/report | 发明 authority query、扫描缺失即修 subject/关闭 gap | `TC-L2T-JOB-002`; `EV-CAND-L2T-JOB-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-023/025/031`; Core authority positive conditional |
| `PG-L2T-JF-03` `RebuildToolDerivedViews`; `tools.job.rebuild_tool_derived_views.v1` | bounded complete source bundle；newer watermark wins；`Fresh/Partial/Failed` 和 report 可重放 | older 覆盖 newer、改 T1/T2 truth、Query inline rebuild | `TC-L2T-JOB-003`; `EV-CAND-L2T-JOB-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-023/025/031`; local P0 isolation, feature optional |
| `PG-L2T-JF-04` `RefreshExternalStatusRefs`; `tools.job.refresh_external_status_refs.v1` | explicit/bounded attempt refs；每目标至多一次 feedback；只追加 status/gap/report | ambiguous 后重调、升级 attempt、写 Delivered/Observed | `TC-L2T-JOB-004`; `EV-CAND-L2T-JOB-001` | `entry-worker-job`; `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-L2T-023/025/029/031`; Bus/Obs event positive conditional |

物理 scheduler、cron、queue、lease、deployment run 与 retry policy 均不在 `JF-*` schema；本步不把其缺失判成本地协议失败，也不声明其存在。

### 6.7 跨仓依赖类型与验收方式

| 关联方 / direction | 当前依赖类型 | 协作 surface | 本地 P0 通过条件 | External positive 条件 / 未就绪裁决 | 禁止误验 |
|---|---|---|---|---|---|
| `L0-core -> L2-tools` | 编译期依赖 | shared ID/context/error/trace/metadata/envelope 类别 | package 边界 scan、shared category compile、tools-specific schema 未闭口时 typed candidate/blocked | `L2T-UP-008` 闭口并提供正式 authority 后单独 qualification；当前不伪造 schema | 复制第二 Core schema；把 generic category 当 tools-specific contract |
| `L3-capability-hub -> L2-tools` | 运行期依赖 | `CF-05~06`,`IF-01`,`JF-01` controlled ref/snapshot | Port/fake parity、ExplicitUnbound zero call、blocked/conflict no relation | owner contract/profile/scope 成立才验 positive snapshot；否则 `blocked_dependency` | sibling package/path dependency、本地 registry/name fallback、验 Hub 完整实现 |
| authorization owner -> L2-tools | 当前项目关系未成立；pending boundary | `CF-09`,`IF-02` formal result consumption | requirement/consumption 分离，missing/stale/conflict fail closed | owner/source matrix 闭口后才建立依赖类型与 positive qualification | 默认指向 Governance、自授权、把 pending 当第四依赖类型 |
| `L4-sandbox -> L2-tools` | 运行期依赖 | `CF-09~11`,`IF-03` readiness/handoff/source | adapter/fake phase parity、no-host、one-call、unknown/manual、no fabricated run | `L2T-UP-001~004` owner/mapping/receipt 闭口后独立真实 seam 验证 | 源码依赖、验 Sandbox 隔离内部实现、fake run/receipt 冒充 positive |
| `L2-tools -> L2-runtime` | 运行期被消费关系 | Commands/Queries normalized outcome/error/audit | 统一 logical schema 与 carrier parity；Runtime 输入不能分叉 L2 truth | Runtime consumer 合同闭口后做 compatibility qualification | L2 依赖 Runtime 源码、吸收 agent loop/planning/orchestration |
| `L2-tools -> L0-bus` | 事件协作依赖 | `OF-01~04`,`IF-04` safe material/status ref | semantic envelope/material/attempt/replay；delivery status 独立 | route/publish/replay/delivery 由 Bus owner 证据闭合；否则 local P0 仍可验 | L2 写 broker truth/topic/group/ack/DLQ 或把 attempt 当 delivery |
| `L2-tools -> L4-observability` | 事件协作依赖 | `OF-01~04`,`IF-05` body-free observation material | redacted safe envelope、status independence、no Obs store/reverse-write | `L2T-UP-005~007` producer/source/route 闭合后 positive qualification | sibling/store dependency、Observed inference、验 Observability 完整实现 |
| `L2-tools -> L0-sdk` | 不适用；future/excluded downstream | `QF-11` 可消费 guidance 与未来服务边界 | SDK 缺失不进入当前 P0；guidance 不生成 client | `L2T-UP-009` 闭口后由 SDK 下游验 client compatibility | `L2-tools -> L0-sdk` package dependency、伪造现成 client |

全局总矩阵仍含“`L2-tools` 按需依赖 `L0-sdk`”的历史表述，但当前正式 00/01/03 已明确 SDK 是 future downstream consumer 且禁止反向 package dependency。本步记录为 `historical_material_conflict`，按当前项目正式裁剪执行，不新增上游 blocker。

### 6.8 37 项协议停审记录

停审维度固定为：`N` 正式 protocol/logical schema 名称；`T` concrete TC 存在；`E` candidate slot、owning suite 和 fixed report 已固定；`D` 依赖类型与 owner 正确；`B` external 未就绪的 blocked/conditional 口径清楚。下表 `pass` 只表示验收标准设计停审通过，不表示协议实现、测试或实际验收通过。

| Protocol gates | N | T | E | D | B | 停审结论 |
|---|---|---|---|---|---|---|
| `PG-L2T-CF-01` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-02` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-03` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-04` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-05` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-06` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-07` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-08` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-09` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-10` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-11` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-12` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-CF-13` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-QF-01~11`（逐项） | 11/11 pass | 11/11 pass | 11/11 pass | 11/11 pass | 11/11 pass | 11/11 pass |
| `PG-L2T-IF-01` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-IF-02` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-IF-03` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-IF-04` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-IF-05` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-OF-01` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-OF-02` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-OF-03` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-OF-04` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-JF-01` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-JF-02` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-JF-03` | pass | pass | pass | pass | pass | pass |
| `PG-L2T-JF-04` | pass | pass | pass | pass | pass | pass |

Query 的 11 项虽合并展示计数，但 §6.3 已逐行固定全部五个维度，因此不是族级抽样停审。总计 `13 + 11 + 5 + 4 + 4 = 37`，停审为 37/37。

### 6.9 跨接口同步门禁审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Protocol inventory | pass | 13/11/5/4/4 与 03 §6.4/§7 完全一致，无 orphan 或额外 surface |
| Logical schema name | pass | 37 项使用正式 snake-case logical schema；无历史 `Register/Invoke/QueryPolicy` 名 |
| Concrete TC identity | pass | 全部回指 05 §6 的真实 `TC-L2T-*`；未生成 `TC-L2T-CF-*` 等伪用例 |
| Evidence phase / path | pass | slot 只作 candidate；fixed run raw/report 配对，最终资格留给 release seal |
| Compile dependency | pass | 仅 Core；tools-specific authority 继续 conditional，不复制 schema |
| Runtime dependency | pass | Hub/Sandbox/Runtime 只经 Port/API/adapter seam；未要求 sibling source package |
| Event dependency | pass | Bus/Obs 验 semantic envelope/attempt/replay；不要求本仓拥有 route/delivery/store |
| Pending / future | pass | authorization pending 与 SDK future 均未伪装成已成立依赖或 P0 positive |
| Downstream readiness | pass | local/negative P0 与 external positive qualification 分离；未要求下游完整实现 |
| Physical surface | pass | 未补造 endpoint/topic/route/group/DLQ/cron/lease/client |
| Query / Job effect | pass | Query zero-write/Port；Job bounded/no-repair；外围实现缺失不反向阻塞核心 |
| Consumer / Event replay | pass | claim/receipt 与 Prepared/unknown fence 明确；不将 ack/delivery/evidence 混入 |
| Owner / reverse-write | pass | Runtime/Hub/Sandbox/Bus/Obs/SDK 均不反写 L2 truth；L2 不吸收其 truth |
| Cross-gate conflict | pass | Step 6 dependency/body/owner redline 与本步协议裁决一致，无 unresolved conflict |

## 7. 回填草稿

正式 §7 应保留：公共 protocol/evidence oracle、37 个协议 gate（可按五族分表）、跨仓依赖类型表、external positive 的 blocked/conditional 判定，以及 37/37 停审和跨接口审计结论。每项必须使用完整 `AC-L2T-*`、`TC-L2T-*`、`EV-CAND-L2T-*`、suite 与 fixed report path；不得使用 `same slot/report` 简写。正式正文不写停审过程，但必须写“candidate 非 evidence、logical 非 physical、local attempt 非 external truth”。

## 8. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| Core tools-specific shared schema | compile positive | `L2T-UP-008`；conditional，不复制 schema |
| Hub/Auth/Sandbox positive owner/mapping | runtime positive | `L2T-UP-001~004/008`；blocked-aware P0 先验，positive 后置 |
| Bus/Obs physical route、receipt、producer/source | event positive | `L2T-UP-004~007`；不补造 topic/route/status truth |
| Runtime/SDK consumer compatibility | downstream qualification | Runtime 只固定消费边界；SDK 由 `L2T-UP-009` 保持 future |

未发现新的上游 blocker；以上均为已登记 `L2T-UP-001~009` 的协议层承接。全局 SDK 表述冲突仅记 historical material。

## 9. 进入下一步条件

- [x] 37 个 formal protocol 全部有 logical schema、pass/fail、concrete TC、candidate slot、suite/report 和 AC 映射。
- [x] 37/37 已逐项完成设计停审，未冒充实际执行结论。
- [x] compile/runtime/event 三类依赖验收方式闭合，pending/future 不形成第四类型。
- [x] external 未就绪时的 local pass、blocked、conditional、failure 边界可判定。
- [x] 跨接口同步审计无 orphan、依赖误判、物理 surface 虚构、证据断裂或下游范围越界。
- [x] 允许进入 Step 8：状态机、事务与一致性验收。
