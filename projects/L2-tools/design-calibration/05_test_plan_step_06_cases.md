# L2-tools 05 测试方案 · Step 6 场景与用例矩阵

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 6「设计测试场景与用例矩阵」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §6
>
> 直接 oracle：`projects/L2-tools/03-详细设计.md` §7~§15，尤其 §15.2~§15.8

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 6 / 设计测试场景与用例矩阵 |
| 状态 | `accepted_for_step_06 / proceed_to_step_07` |
| 当前模块 | `test_scenarios_and_case_matrix` |
| case identity | `TC-L2T-<FAMILY>-<NNN>`；每个 canonical 设计切口至少一个稳定 case |
| EV identity | planned `EV-CAND-L2T-<FAMILY>-<NNN>`；只定义证据类别，不代表真实实例 |
| 本步结论 | 核心协议、状态、事务、并发、错误、配置、观测和否决族均具备用例；逐切口与跨用例审计已通过 |
| 下一步 | Step 7：测试数据设计（本步停审已通过） |

## 2. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 双向追溯矩阵 | `05_test_plan_step_05_traceability_coverage.md` | case family、需求和EV族映射 |
| Command/Query/Consumer/Event/Job protocol cards | `03` §7~§8 | 字段、调用顺序、错误和replay oracle |
| 六状态族 | `03` §9 | 合法/非法状态迁移和terminal guard |
| Store/UoW/CAS/幂等/并发/错误 | `03` §10~§12 | consistency、replay、unknown和恢复case |
| 配置/观测契约 | `03` §13~§14、`04` §9~§12 | CFG/OBS/redaction/entry gate case |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 每个P0正向主线怎么执行？ | 用确定性 typed fixture 构造正式对象，按03 flow card顺序调用唯一 facade/trait，检查正式状态、Store/UoW写集、stored result和禁止副作用。 | `03` §7.3、§8、§10 |
| 关键反向/边界如何触发？ | 缺失必填字段、wrong-kind ref、版本/范围冲突、stale CAS、duplicate/different digest、source blocked、forbidden body、unknown side effect、非法迁移和配置冲突均由专用 fixture/fault profile触发。 | `03` §7.3.1、§9~§13；`04` CFG-F/X |
| 状态非法迁移如何断言？ | 直接调用同层 transition helper，断言正式 typed error、零不允许写入、历史/terminal字段不变；不以字符串状态比较代替 enum。 | `03` §9、§11 |
| 事务回滚和副作用如何验证？ | 用UoW/Store spy记录写集和commit outcome；CF-10/CF-12/OF只在Prepared commit后允许一次Port调用，unknown保持manual。 | `03` §10、§12 |
| 恢复场景如何复现？ | 预置 Claimed/Committed/Prepared/Unknown/Partial/Stale/Failed surface，再以同一key/digest重入；只允许命名 replay/resolve flow，不从current truth重算。 | `03` §11~§12 |
| 预期结果引用什么正式名称？ | 03中的对象字段、enum label、PortResolution、Application/Domain error、StoredCommandResult、ConsumerReceipt、JobReport、ProjectionRead等。 | `03` §6~§15 |
| 是否存在后续phase越界？ | 所有外部 `Delivered`、`Observed`、provider `Accepted`、Sandbox `run/receipt`、evidence/signoff/readiness均明确 forbidden as current oracle。 | `03` §9.5~§9.7、§15.6 |

## 4. Case identity 与共同执行纪律

### 4.1 编号规则

| Family | 编号范围（planned） | 设计来源 |
|---|---|---|
| `FOUNDATION` | `TC-L2T-FOUNDATION-001~018` | 03 §15.2 contracts/domain/application/infra/entry |
| `CONTRACT` | `TC-L2T-CONTRACT-001~008` | CF-01~04、QF-01~02、合同状态 |
| `BIND` | `TC-L2T-BIND-001~008` | CF-05~07、IF-01/JF-01 |
| `INV` | `TC-L2T-INV-001~008` | CF-08、QF-04、IF-03 |
| `PRE` | `TC-L2T-PRE-001~010` | CF-09~10、IF-02、handoff状态 |
| `OUTCOME` | `TC-L2T-OUTCOME-001~010` | CF-11、QF-06、IF-03、outcome状态 |
| `HANDOFF` | `TC-L2T-HANDOFF-001~008` | CF-12、OF-01~04、IF-04~05、JF-04 |
| `QUERY` | `TC-L2T-QUERY-001~011` | QF-01~11 |
| `CONSUMER` | `TC-L2T-CONSUMER-001~005` | IF-01~05 |
| `CONT` | `TC-L2T-CONT-001~004` | OF-01~04 |
| `JOB` | `TC-L2T-JOB-001~004` | JF-01~04 |
| `STATE` | `TC-L2T-STATE-001~012` | 六状态族合法/非法 |
| `TX` | `TC-L2T-TX-001~010` | 03 §10/§15.7 |
| `CONC` | `TC-L2T-CONC-001~023` | 03 §12.6 |
| `ERR` | `TC-L2T-ERR-001~012` | 03 §11.6 |
| `CFG` | `TC-L2T-CFG-001~007` | 03 §15.8 |
| `CFG-T/A/F/X` | `TC-L2T-CFG-T-001~012`, `A-001~010`, `F-001~020`, `X-001~012` | 04 §12.2~§12.3、§9.5、§11 |
| `OBS` | `TC-L2T-OBS-001~009` | 03 §14/§15.8 |
| `VETO` | `TC-L2T-VETO-001~013` | 00 §14.3、NC-L2T-001~025 |

### 4.2 共同 oracle 优先级

1. 03 正式字段/enum/flow/state/error。
2. 03 §15 最小验证清单的切口断言。
3. 04 配置项/失败族/交叉校验和生效方式。
4. 00 需求/规则/NFR/AC/VF 方向。
5. 不使用旧05/06、README、实现猜测或外部 owner 未闭口的正向状态。

### 4.3 共同禁止断言

| 禁止断言 | 替代断言 |
|---|---|
| `Delivered` / `Observed` 由本地 attempt 推导 | `SubmittedLocally`、独立 `BusDeliveryStatusRef`/`ObservationMaterialRef` 状态 |
| `Accepted` 由 endpoint/ref/health marker 推导 | `Blocked`/`Unavailable`/`Unverifiable` 或正式 PortResolution |
| `Completed` 作为所有流程终态 | 使用具体状态族 enum 和当前 phase terminal |
| raw stdout/provider body 等于 outcome | `ExecutionSourceAssessment` + `ToolInvocationOutcome` |
| query/job 成功后自动修复 | no-write/no-repair，并保留 `Stale`/`Partial`/`Failed` |
| unknown 自动 retry | `CallOutcomeUnknown`/`SubmissionOutcomeUnknown` + manual fence |

## 5. Foundation、合同、Binding 与 Invocation cases

### 5.1 Foundation cases

| TC ID | 场景/前置 | 操作 | 预期结果与断言 | 类型 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-FOUNDATION-001` | 合法 typed ToolId/ref/scope | 构造 refs并roundtrip | exact kind/scope保留；wrong-kind拒绝；无字符串fallback | 正向/负向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-002` | 缺 CommandMetadata TraceContext | 构造Command请求 | metadata validation拒绝，zero write/Port | 负向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-003` | Query/Envelope/Job metadata边界样本 | 分别构造 | 各自required actor/source/correlation/scope校验，不交叉替代 | 边界 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-004` | 每个协议族合法variant | encode/decode canonical DTO | version、variant、typed fields对称 | 正向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-005` | unknown version/variant | decode输入 | `UnsupportedSchema`或正式ProtocolError，未写入 | 负向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-006` | body/secret/credential输入 | 构造任何public carrier | forbidden body reject，安全issue不含原文 | 安全 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-007` | Found/Empty/NotFound/NotVisible surface | map各surface | 不坍缩为空成功，freshness/visibility保留 | 边界 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-008` | stale/rebuilding/unavailable/failed projection | map ProjectionRead | 显式degraded surface，无hidden rebuild | 负向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-009` | typed ProtocolError和retry hint | map domain/app error | error class/retry hint/body-free对称 | 正向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-010` | 41对象factory缺required字段 | 调factory | typed validation error，未造placeholder | 负向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-011` | explicit Clock/ID fixture | 构造同语义两次 | semantic digest不含生成ID/arrival time，身份规则稳定 | 边界 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-012` | `Loaded<T>`/CAS token | 读取并save | expected_version只来自Store load，stale token拒绝 | 一致性 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-013` | `AppendResult` equal/conflict | 重复append | ExistingEqual只回放，Conflict不覆盖 | 幂等 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-014` | StoredCommandResult/Receipt/JobReport | claim后保存 | stored surface在claim complete前存在且typed | 一致性 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-015` | VisibilityDecision not-visible/unavailable | mapper读取 | 不泄露存在性、不default visible | 安全 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-016` | AdapterAvailability blocked/unsupported | map adapter | availability不升级external ready | 负向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-017` | query mapper调用可写helper | 注入write spy | 不调用begin/refresh/repair/Port | 负向 | `EV-CAND-L2T-FOUNDATION-001` |
| `TC-L2T-FOUNDATION-018` | all public event/report/view surfaces | redaction sweep | 无raw正文、secret、credential、high-cardinality body | 安全 | `EV-CAND-L2T-FOUNDATION-001` |

### 5.2 Contract cases

| TC ID | 场景 | 操作 | 正式 oracle | 负向/边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-CONTRACT-001` | CF-01有效首建 | 建立identity/revision/definition/source/binding mode | ToolContract `Active`；definition `Current`；evolution fact、stored result同UoW | duplicate identity/source blocked zero truth write | `EV-CAND-L2T-CONTRACT-001` |
| `TC-L2T-CONTRACT-002` | CF-01同key同digest重放 | 重复提交 | exact immutable `ToolContractView` replay；无第二fact/ID | different digest=`IdempotencyConflict` | `EV-CAND-L2T-CONTRACT-001` |
| `TC-L2T-CONTRACT-003` | CF-02候选评估 | 提交body-free source/candidate | `Candidate` + `ToolCompatibilityImpact`；current pointer不变 | stale/conflict/unverifiable只assessment/error | `EV-CAND-L2T-CONTRACT-001` |
| `TC-L2T-CONTRACT-004` | CF-03兼容采用 | 提交兼容 impact 与 expected revision | candidate `Current`、旧 definition `Superseded`、current pointer 一次切换；evolution fact 与 stored result 同 UoW | incompatible/CAS/closure 冲突全 rollback；不产生半切换 | `EV-CAND-L2T-CONTRACT-001` |
| `TC-L2T-CONTRACT-005` | CF-04退役请求/完成 | 两种action按flow执行 | `Active -> RetirementPending -> Retired`；历史保留 | terminal回退/closure缺失不删/不复活 | `EV-CAND-L2T-CONTRACT-001` |
| `TC-L2T-CONTRACT-006` | QF-01 current/history读取 | owner-first query | Found/NotFound/NotVisible/Stale分型，zero write | 不从provider/inventory补current | `EV-CAND-L2T-CONTRACT-001` |
| `TC-L2T-CONTRACT-007` | QF-02 revision diff | base/target有向比较 | directed `ToolContractDiffSummary`，不触发adopt | reversed/missing/unverifiable正确分型 | `EV-CAND-L2T-CONTRACT-001` |
| `TC-L2T-CONTRACT-008` | contract terminal/late material | 已Retired或Superseded后补材料 | terminal不被覆盖；只append assessment/gap | 不回Active/Current | `EV-CAND-L2T-CONTRACT-001` |

### 5.3 Binding cases

| TC ID | 场景 | 操作 | 正式 oracle | 负向/边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-BIND-001` | CF-05 ExplicitUnbound | 提交正式空关联及reason | `AcceptedExplicitUnbound`；Hub Port调用次数为0 | empty ref/name fallback拒绝 | `EV-CAND-L2T-BIND-001` |
| `TC-L2T-BIND-002` | CF-05 Bound | 提交Hub typed ref/snapshot | relation、snapshot、assessment、change fact同UoW | Hub blocked/conflict不写relation | `EV-CAND-L2T-BIND-001` |
| `TC-L2T-BIND-003` | CF-06 replacement | current binding + distinct successor + CAS | old `Replaced`、successor唯一current | stale CAS/duplicate successor不半替换 | `EV-CAND-L2T-BIND-001` |
| `TC-L2T-BIND-004` | CF-07 invalidation | typed reason + expected_version | `Invalidated`，history retained | terminal/missing reason/CAS conflict不恢复 | `EV-CAND-L2T-BIND-001` |
| `TC-L2T-BIND-005` | QF-03 selector | ByBindingId/CurrentByToolId/assessment selector | selected snapshot/assessment/gap source对称 | null不推断ExplicitUnbound；two-current integrity failure | `EV-CAND-L2T-BIND-001` |
| `TC-L2T-BIND-006` | IF-01 Hub clue | supported/blocked/duplicate envelope | snapshot/assessment/gap/receipt或GapRecorded | 不改Binding relation；duplicate zero Port/page/write | `EV-CAND-L2T-BIND-001` |
| `TC-L2T-BIND-007` | JF-01 bounded relation check | non-empty scope + bounded page | assessment/gap/report；explicit-unbound不调Hub | empty scope/unbounded/partial不修relation | `EV-CAND-L2T-BIND-001` |
| `TC-L2T-BIND-008` | late Hub change | relation已用于invocation后到变化 | 新assessment/gap，既有anchor/invocation不改 | 不把visibility变authorization | `EV-CAND-L2T-BIND-001` |

### 5.4 Invocation cases

| TC ID | 场景 | 操作 | 正式 oracle | 负向/边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-INV-001` | CF-08合法canonical invocation | active contract + safe context + operation | immutable `ToolInvocation`、anchor、`Admitted`或`AwaitingPrecondition` | 不调用external Port | `EV-CAND-L2T-INV-001` |
| `TC-L2T-INV-002` | CF-08 no-execution | retired/missing definition/binding conflict/insufficient context | `Rejected`/`Unavailable` + atomic outcome/audit pair | 不写accepted/executed/run | `EV-CAND-L2T-INV-001` |
| `TC-L2T-INV-003` | caller/carrier parity | direct/adapter/sandbox request同canonical frame | same invocation/digest/result/error semantics | 不允许carrier私有DTO | `EV-CAND-L2T-INV-001` |
| `TC-L2T-INV-004` | expected revision drift | request带旧revision | formal conflict/blocked，zero accepted mutation | 不静默使用current revision | `EV-CAND-L2T-INV-001` |
| `TC-L2T-INV-005` | duplicate admission | same key/digest再次提交 | exact stored view replay；无第二admission/pair | different digest conflict | `EV-CAND-L2T-INV-001` |
| `TC-L2T-INV-006` | QF-04 view | invocation存在/缺outcome/not-visible | visible view可带`outcome_ref=None`；surface分型 | 不从Runtime/Sandbox推断outcome | `EV-CAND-L2T-INV-001` |
| `TC-L2T-INV-007` | IF-03 derived key | Sandbox envelope可归因 | only deterministic CF-11 re-entry key | altered digest/unsupported不直接写outcome | `EV-CAND-L2T-INV-001` |
| `TC-L2T-INV-008` | terminal re-admission | 已有terminal outcome再次admit | typed terminal conflict，pair不重复 | 不覆盖既有终态 | `EV-CAND-L2T-INV-001` |

## 6. Preconditions、Outcome 与 Handoff cases

### 6.1 Precondition/handoff cases

| TC ID | 场景 | 操作 | 正式 oracle | 负向/边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-PRE-001` | CF-09 requirement分类 | 各definition/binding/invocation组合 | `NoExternalGovernance`/`AuthorizationRequired`/`SandboxRequired`/组合/`Unsupported` | requirement不等allow | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-002` | auth accepted/deny | scripted typed auth result | assessment正式label；deny/no result不执行 | 不由本地policy自授权 | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-003` | auth missing/stale/conflict/unverifiable | blocked Port resolution | fail-closed、`AwaitingPrecondition`/`Rejected`或gap | 不default allow、无旧decision fallback | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-004` | IF-02 auth clue | valid/unsupported/altered envelope | assessment/gap/receipt；不生成authorization truth | duplicate零Port/write | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-005` | Sandbox readiness blocked | readiness mapping blocked/unavailable | `MappingBlocked`/`Unavailable`，no-host fallback | 不创建run/receipt/capture | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-006` | CF-10 eligible preparation | requirement/auth/readiness refs完整 | `ExecutionHandoff` `Preparing -> Eligible`；phase-1 `Prepared` commit | Prepared不等accepted/run | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-007` | CF-10 known Port failure | exactly one scripted Port call returns known failure | `LocallyFailed`/`CarrierUnavailable`/`MappingBlocked`；phase-2 CAS | no retry/host fallback | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-008` | CF-10 call outcome unknown | Port call may have crossed boundary | `CallOutcomeUnknown`，manual fence、no second call | 不写external accepted | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-009` | CF-10 phase-2 stale CAS | phase-1 token已过期 | local disposition not overwritten；gap/manual | 不重建handoff | `EV-CAND-L2T-PRE-001` |
| `TC-L2T-PRE-010` | late auth/readiness clue | old assessment already persisted | append new assessment/gap；old admission/attempt unchanged | 不原地翻Admitted | `EV-CAND-L2T-PRE-001` |

### 6.2 Outcome cases

| TC ID | 场景 | 操作 | 正式 oracle | 负向/边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-OUTCOME-001` | CF-11 accepted source success | attributable source + safe semantic result | `ExecutionSourceAssessment=Accepted`；唯一成功terminal + `ToolAuditEntry` atomic pair | result/error XOR | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-002` | tool/execution/capture failure | source maps to each failure class | exact six terminal class，audit pair仍成对 | 不把raw capture当结果 | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-003` | no-execution outcome | CF-08/09拒绝或不可用 | no-execution terminal/audit pair；无run/capture | 不标executed | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-004` | source missing/stale/conflict | Port returns blocked resolution | assessment/gap/error only；无terminal outcome | 不猜success/failure | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-005` | duplicate CF-11 | same source key/digest重入 | stored pair replay；Port不二次调用 | different digest conflict | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-006` | late source after terminal | terminal pair已存在 | append assessment/ref/gap；terminal immutable | no overwrite | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-007` | QF-06 half pair | Store故意只返回outcome或audit | `IntegrityFailure`/unknown surface，不补另一半 | query zero write | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-008` | outcome/audit body redaction | result/audit含forbidden body | reject/no material；safe issue only | 加密不构成例外 | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-009` | QF-06 external status degraded | Bus/Obs refs missing/conflict | local pair仍可读，status独立unknown/gap | 不改local terminal | `EV-CAND-L2T-OUTCOME-001` |
| `TC-L2T-OUTCOME-010` | source correlation mismatch | source invocation/anchor不匹配 | mapping rejected/gap；zero outcome write | 不用event id猜subject | `EV-CAND-L2T-OUTCOME-001` |

### 6.3 Safe handoff and continuation cases

| TC ID | 场景 | 操作 | 正式 oracle | 负向/边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-HANDOFF-001` | CF-12四门全通过 | local committed source + target + redaction/correlation | `Eligible`、immutable `SafeHandoffMaterial`、claim | material不含body | `EV-CAND-L2T-HANDOFF-001` |
| `TC-L2T-HANDOFF-002` | 每个安全门单独失败 | 缺minimal/body-free/redacted/correlated任一 | `Ineligible`/`Unverifiable`；无material、无Port | 不降级放行 | `EV-CAND-L2T-HANDOFF-001` |
| `TC-L2T-HANDOFF-003` | OF-01 ContractChange | committed material->event map->Prepared->one Port | local `ExternalSubmissionAttempt` phase正确 | 不Delivered | `EV-CAND-L2T-HANDOFF-001` |
| `TC-L2T-HANDOFF-004` | OF-02 BindingChange | symmetric source/target material | attempt和event identity对称，Binding不变 | source/target冲突拒绝 | `EV-CAND-L2T-HANDOFF-001` |
| `TC-L2T-HANDOFF-005` | OF-03 outcome/audit refs-only | half/full pair材料 | only refs/safe summary，local disposition | forbidden body/half pair不交接 | `EV-CAND-L2T-HANDOFF-001` |
| `TC-L2T-HANDOFF-006` | OF-04 gap material | open/terminal/foreign gap | local attempt/gap refs；不repair/reopen | scope mismatch拒绝 | `EV-CAND-L2T-HANDOFF-001` |
| `TC-L2T-HANDOFF-007` | Prepared/SubmissionOutcomeUnknown replay | same continuation key重入 | return marker/manual，Port call count不增加 | 禁generic retry | `EV-CAND-L2T-HANDOFF-001` |
| `TC-L2T-HANDOFF-008` | IF-04/05/JF-04 feedback | status ref known/stale/conflict/route blocked | independent status ref/gap/receipt/report | 不写Delivered/Observed、不改attempt/outcome | `EV-CAND-L2T-HANDOFF-001` |

## 7. Query、Consumer、Continuation 与 Job cases

### 7.1 Query cases

| TC ID | 覆盖QF | 前置/操作 | 预期 surface与断言 | 共同no-write断言 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-QUERY-001` | QF-01 | owner scope + current/history bundle | Found/NotFound/NotVisible/Stale；bundle refs/watermark对称 | zero UoW/Port/refresh | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-002` | QF-02 | directed base/target definitions | diff summary只读；missing/mismatch分型 | 不adopt/rebuild | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-003` | QF-03 | binding selector/assessment | explicit-unbound可见；two-current/ref mismatch integrity | 不refresh Hub | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-004` | QF-04 | invocation bundle with/without outcome | view可带None outcome；not-visible不泄露 | 不replay Command | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-005` | QF-05 | precondition layered bundle | None/blocked/unknown显式；watermark一致 | 不调用Auth/Sandbox Port | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-006` | QF-06 | pair+status refs | complete pair Found；half pair IntegrityFailure；status optional | 不补audit/feedback | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-007` | QF-07 | bounded report | Current/Partial/Stale/Failed/Rebuilding surface | 不生成report/修gap | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-008` | QF-08 | filter/page/cursor digest | stable order、CursorInvalid、projection freshness分型 | 不全表扫描/写projection | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-009` | QF-09 | stored diff projection | Fresh/Stale value；Unavailable无value | 不fallback QF-02/write | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-010` | QF-10 | typed diagnostic scope | safe local summary；unknown subject拒绝 | 不health/readiness/recovery | `EV-CAND-L2T-QUERY-001` |
| `TC-L2T-QUERY-011` | QF-11 | consumer guidance revision | guidance只读、freshness/blocked分型 | 不生成SDK/plan/auth decision | `EV-CAND-L2T-QUERY-001` |

### 7.2 Consumer cases

| TC ID | 覆盖IF | 前置/操作 | 预期结果 | 负向/重放 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-CONSUMER-001` | IF-01 | Hub clue envelope valid/blocked | phase-1 claim后assessment/snapshot/gap/receipt | duplicate零Port/page/write；不改Binding | `EV-CAND-L2T-CONSUMER-001` |
| `TC-L2T-CONSUMER-002` | IF-02 | invocation-bound auth result | assessment/gap/receipt，不生成decision | owner/schema/revision mismatch quarantine | `EV-CAND-L2T-CONSUMER-001` |
| `TC-L2T-CONSUMER-003` | IF-03 | Sandbox source envelope | derived CF-11 key re-entry，pair replay | altered/unsupported/mapping blocked不直接写outcome | `EV-CAND-L2T-CONSUMER-001` |
| `TC-L2T-CONSUMER-004` | IF-04 | Bus feedback | `BusDeliveryStatusRef`/gap/receipt | unknown/stale/conflict/route blocked；不写Bus truth | `EV-CAND-L2T-CONSUMER-001` |
| `TC-L2T-CONSUMER-005` | IF-05 | Observation material feedback | Observation ref/status/gap/receipt | 不写Observed/Observability store | `EV-CAND-L2T-CONSUMER-001` |

### 7.3 Continuation and Job cases

| TC ID | 覆盖flow | 前置/操作 | 预期结果 | 负向/边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-CONT-001` | OF-01 | committed ContractChange material | canonical event/attempt identity symmetric | duplicate/route blocked/unknown no delivered | `EV-CAND-L2T-CONT-001` |
| `TC-L2T-CONT-002` | OF-02 | BindingChange material | source/target refs symmetric；Binding unchanged | mismatch/Prepared replay no second call | `EV-CAND-L2T-CONT-001` |
| `TC-L2T-CONT-003` | OF-03 | outcome/audit refs-only material | local disposition only | half pair/body/unknown blocked | `EV-CAND-L2T-CONT-001` |
| `TC-L2T-CONT-004` | OF-04 | gap material | attempt/gap refs only | terminal/scope mismatch/status unknown no reopen | `EV-CAND-L2T-CONT-001` |
| `TC-L2T-JOB-001` | JF-01 | non-empty bounded relation scope | assessment/gap/report，explicit-unbound no Hub | empty/unbounded/partial no repair | `EV-CAND-L2T-JOB-001` |
| `TC-L2T-JOB-002` | JF-02 | bounded reference targets | validity assessment/gap/report | candidate-only/unverifiable no authority query/subject repair | `EV-CAND-L2T-JOB-001` |
| `TC-L2T-JOB-003` | JF-03 | projection source bundle/watermark | Rebuilding->Fresh/Partial/Failed，newer watermark wins | older no overwrite;Query no rebuild | `EV-CAND-L2T-JOB-001` |
| `TC-L2T-JOB-004` | JF-04 | explicit attempt refs | one feedback call/status/report | route blocked/unknown/duplicate no Delivered/Observed | `EV-CAND-L2T-JOB-001` |

## 8. State、transaction、concurrency、error cases

### 8.1 State cases

| TC ID | 状态族 | 正向迁移 | 非法/边界断言 | EV族 |
|---|---|---|---|---|
| `TC-L2T-STATE-001` | contract evolution | Candidate->Current；Active->RetirementPending | incompatible/terminal reactivation typed error、zero mutation | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-002` | contract lifecycle | RetirementPending->Retired | missing closure/CAS conflict不删/不复活 | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-003` | binding/source | Active->Replaced/Invalidated；Bound与ExplicitUnbound分离 | empty ref/two-current/terminal replace拒绝 | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-004` | invocation/admission | Sufficient->Admitted或AwaitingPrecondition | Awaiting原地变Admitted、terminal re-admission拒绝 | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-005` | precondition/handoff | Preparing->Eligible/Blocked；Prepared->local terminal | terminal回Prepared、unknown auto retry拒绝 | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-006` | outcome/safe handoff | source Accepted->terminal；四门->Eligible/material | terminal overwrite、Ineligible material、local->Delivered/Observed拒绝 | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-007` | integrity gap | Open->ResolutionPending->Resolved/Superseded | 无owner reread/terminal gap不resolve | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-008` | projection | Rebuilding->Fresh/Partial/Failed | older watermark不Current；Query不触发迁移 | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-009` | state label mapping | all six family enum labels | unknown/reserved label不silent default | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-010` | factory source state | construct each command initial state | factory保留当前flow可执行from-state | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-011` | late material | terminal/local history exists | append assessment/ref/gap only | `EV-CAND-L2T-STATE-001` |
| `TC-L2T-STATE-012` | phase fence | phase-1/phase-2 markers | no cross-phase status assertion | `EV-CAND-L2T-STATE-001` |

### 8.2 Transaction cases

| TC ID | 事务切口 | 操作/故障 | 断言 | EV族 |
|---|---|---|---|---|
| `TC-L2T-TX-001` | accepted truth + stored result | commit known | all named writes and replay surface same UoW | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-002` | outcome/audit pair | fail one insert | both absent; no half pair | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-003` | CF-10 Prepared fence | crash before Port/after phase1 | marker committed; exactly-one continuation rule | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-004` | phase-2 CAS | stale token | no terminal overwrite; gap/manual | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-005` | known rollback | Store/UoW known error | rollback all current UoW writes | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-006` | commit unknown | commit result ambiguous | resolve_commit required; no blind rerun | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-007` | Query no-write | spy UoW/Store/Port | zero write/refresh/external call | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-008` | Job bounded UoW | mixed target success/failure | per-target report/partial; no subject repair | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-009` | semantic uniqueness | equal/divergent append | ExistingEqual replay vs Conflict | `EV-CAND-L2T-TX-001` |
| `TC-L2T-TX-010` | missing replay surface | claim committed without result | DuplicateResultMissing/manual; no reconstruction | `EV-CAND-L2T-TX-001` |

### 8.3 Concurrency/replay cases

| TC ID | 03切口 | 并发/重入操作 | 断言 | EV族 |
|---|---|---|---|---|
| `TC-L2T-CONC-001` | same key winner | two same digest claims | one winner，另一个exact replay/in-flight | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-002` | different digest | same key divergent intent | IdempotencyConflict，zero mutation | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-003` | scope isolation | same key different actor/source scope | independent namespaces | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-004` | stale CAS | concurrent current/binding update | loser VersionConflict，不建第二current | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-005` | equal/divergent append | same fact/material append | ExistingEqual vs Conflict，history不覆盖 | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-006` | consumer redelivery | same envelope twice | receipt replay，零二次副作用 | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-007` | altered consumer payload | same dedup key altered digest | quarantine/conflict，zero write | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-008` | unsupported schema pre-write | version invalid before claim | reject before claim/Port/write | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-009` | IF-03 at-most-once | redelivered source | derived CF-11 key exact replay | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-010` | event duplicate | same material/event | no collaboration second call | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-011` | Prepared replay | handoff attempt Prepared | marker/manual; no auto-submit | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-012` | phase-2 race | two disposition updates | one CAS winner，terminal unchanged thereafter | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-013` | Job duplicate report | same job key/digest | exact JobReport replay | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-014` | cursor continuation | next bounded page | new key + exact previous watermark | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-015` | partial report | mixed target outcomes | successful refs/counts retained; failure typed | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-016` | older projection | two watermark writes | older returns Stale/no overwrite | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-017` | query during rebuild | projection Rebuilding | explicit surface/no write | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-018` | status equal/divergent | same/different authority ref | equal reuse; divergent gap; attempt unchanged | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-019` | stale handoff fence | late phase2 update | CAS/manual; no terminal overwrite | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-020` | commit unknown resolve | resolve same authority | resolve before mutation; no new key | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-021` | missing stored result | duplicate committed claim | DuplicateResultMissing/manual; no recompute | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-022` | late material | terminal outcome then source | append assessment/ref/gap only | `EV-CAND-L2T-CONC-001` |
| `TC-L2T-CONC-023` | forbidden body digest | same semantic with body variation | raw body excluded/rejected; no digest leak | `EV-CAND-L2T-CONC-001` |

### 8.4 Error/recovery cases

| TC ID | 错误切口 | 触发 | 断言/恢复owner | EV族 |
|---|---|---|---|---|
| `TC-L2T-ERR-001` | validation | required/wrong-kind/version | InvalidInput；zero write/Port | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-002` | invalid transition | terminal/illegal from-state | InvalidState；state/history unchanged | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-003` | version/unique conflict | stale CAS/duplicate successor | Conflict；reload/re-evaluate, no half-write | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-004` | Store unavailable | named Store unavailable | typed unavailable；no default/fallback | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-005` | UoW unavailable | begin/commit capability missing | fail-fast/rollback；no partial graph | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-006` | commit unknown | ambiguous commit | resolve/manual；no blind replay | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-007` | side-effect unknown | Port boundary ambiguous | CallOutcomeUnknown/SubmissionOutcomeUnknown；no second call | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-008` | blocked resolver | owner/schema/mapping blocked | fail-closed/gap；no positive readiness | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-009` | forbidden response | raw body/secret | reject/safe issue only | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-010` | replay missing | result/receipt/report missing | DuplicateResultMissing/manual | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-011` | unsupported schema/partial job | envelope version or mixed target | quarantine/partial typed report；no repair | `EV-CAND-L2T-ERR-001` |
| `TC-L2T-ERR-012` | late terminal conflict | late source/status | append gap/assessment；terminal unchanged | `EV-CAND-L2T-ERR-001` |

## 9. Configuration cases

### 9.0 Detailed-design configuration baseline cases (`CFG`)

`TC-L2T-CFG-001~007` 逐条承接 `03` §15.8 的七个最小配置切口。它们是跨配置域的
baseline case，不替代后续 `CFG-T/A/F/X` 的细化用例；每个 baseline case 的可执行操作和
断言由表中列出的细化用例共同闭合。

| TC ID | `03` 最小切口 | 前置 / 操作 | 正式 oracle | 细化覆盖 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-CFG-001` | `L2T-CFG-001` section-local malformed/oversized/unbounded | 对十 root 逐域注入 malformed、oversized、unbounded 和 raw-sensitive candidate | typed issue + `ConfigSourceRef`；无 raw config/secret、无 runtime bundle | `CFG-T-001/004`;`CFG-F-001~004/008/020` | `EV-CAND-L2T-CFG-001` |
| `TC-L2T-CFG-002` | `L2T-CFG-002` seven Store/UoW/idempotency/projection mismatch | 逐一移除或错配 Store、UoW、replay、projection capability | V4/V5 或 B1/B2 前拒绝；无 entry exposure、无隐式补齐 | `CFG-T-006/007/010`;`CFG-F-005~007/019`;`CFG-X-002/003/005/012` | `EV-CAND-L2T-CFG-001` |
| `TC-L2T-CFG-003` | `L2T-CFG-003` pair/CAS/resolve capability missing | 注入缺 pair atomicity、CAS token 或 resolve surface 的 adapter metadata | `MissingUnitOfWorkCapability`/`UnsupportedCapability`/`MissingReplaySurface`；不得降级为 split transaction | `CFG-F-006/007`;`CFG-X-002/003` | `EV-CAND-L2T-CFG-001` |
| `TC-L2T-CFG-004` | `L2T-CFG-004` disabled/degraded/unavailable/blocked adapter | 在三个 P0 profile 中分别装配四类 availability surface | 只返回正式 typed availability/degraded surface；truth/readiness 不变 | `CFG-T-005/008`;`CFG-A-007/009`;`CFG-F-010~015`;`CFG-X-006~008` | `EV-CAND-L2T-CFG-001` |
| `TC-L2T-CFG-005` | `L2T-CFG-005` peripheral feature disabled | 逐项关闭 outbound event、projection/status peripheral registration | 仅取消对应 registration；identity/admission/outcome/audit/safety 仍可判定 | `CFG-F-015`;`CFG-X-005/008/012` | `EV-CAND-L2T-CFG-001` |
| `TC-L2T-CFG-006` | `L2T-CFG-006` fake/durable parity | 用同 candidate、key/digest、fault sequence 执行 fake 与 durable-candidate adapter contract | error/key/digest/redaction/blocked surface 对称；fake 不构成 external readiness | `CFG-T-005/007/008`;`CFG-A-005/007`;`CFG-X-001/002/006` | `EV-CAND-L2T-CFG-001` |
| `TC-L2T-CFG-007` | `L2T-CFG-007` forbidden override | 对 `NC-L2T-001~025` 逐项注入 config/source/feature override | 全部 typed reject；actor/schema/key/safety/state/Query no-write/delivery 语义不变 | `CFG-A-006`;`CFG-F-009/020`;`CFG-X-009~011`;`VETO-001~013` | `EV-CAND-L2T-CFG-001` |

### 9.1 Configuration contract cases (`CFG-T`)

这些用例验证 `04` 的 operator-facing strict configuration contract。它们只读取 typed
candidate、validator、builder 和 safe issue surface；不验证真实部署、provider readiness 或
具体产品 backend。

| TC ID | 04 主题 | 前置 / 操作 | 正式 oracle | 负向 / 禁止 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-CFG-T-001` | strict JSON 语法 | 逐一注入 comment、trailing comma、duplicate key、unknown key、alias、null、coercion | V0 返回 typed issue；无 runtime bundle、entry 或 raw value | 不容错解析、不静默丢字段 | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-002` | D/F/E precedence | 同一 canonical leaf 分别由 default/file/env 提供合法值 | 仅按 `D < F < E` 覆盖；source attribution 保留 | 高优先级非法不得回退低优先级 | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-003` | R/X/L lane isolation | 同时提供 opaque ref、Local/CI fixture 和 entry/job selector | R/X/L 各自只作用于允许 scope；selector 不改 global candidate | fixture 不进入 real-like；leaf 不改全局 | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-004` | 54 item schema | 生成十 root、54 item 的 required/type/default/scope/sensitivity 样本 | 每个 item 有稳定 typed parse 和 failure class | 未登记 item 不可通过 extension map | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-005` | P0 profile isolation | 构造 local-dev、ci-test、integration-like 三 profile | profile 与 dependency/fixture/Clock-ID 组合相容；staging/production inactive | fake、deterministic 或 inactive profile 不得冒充 ready | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-006` | cross-field gates | 分别满足和违反 `CFG-X-01~12` | 每个 gate 输出对应 typed issue 或 blocked-aware plan | 不跳过 gate、不由 feature 绕过 | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-007` | local capability binding | 预置七 Store、one UoW、CAS/pair/page/watermark/replay capability | V5 成功只形成 local-capable refs；缺 capability fail-fast | 不用 memory/cache/hidden transaction 补齐 | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-008` | external blocked-aware binding | `L2T-UP-001~009` 各给 blocked/unavailable/unverifiable typed result | V6 形成 blocked-aware adapter plan；不变 Available | endpoint/ref/health marker 不升级 readiness | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-009` | redaction floor | 提供 equal、stricter、looser body policy/diagnostic policy | equal-or-stricter 通过；looser 和 raw field fail-closed | 不以 debug/emergency 放宽 | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-010` | immutable activation | builder 按 V0~V8、B0~B8 顺序装配 | 只暴露一个 immutable `ToolsRuntimeConfig` bundle | 不 hot reload、admin override 或 partial expose | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-011` | change/rollback candidate | high change 带 actor/reason/review/digest/rollback ref | previous candidate 重新校验后才可新 assembly；entry/job history 不改写 | 不 live patch、skip validation 或复活 compromised ref | `EV-CAND-L2T-CFG-T-001` |
| `TC-L2T-CFG-T-012` | config identity drift | 两个 safe config identity/digest projection 比较 | drift 阻断新 assembly并输出 safe issue；raw diff 不外泄 | 不声称 workspace/deployment baseline 已冻结 | `EV-CAND-L2T-CFG-T-001` |

### 9.2 Configuration acceptance-direction cases (`CFG-A`)

`CFG-A` 是给后续 `06` 消费的门禁方向，不是当前验收结果。每个用例必须在执行时绑定
真实 suite artifact；本 Step 只定义 oracle 和 planned EV。

| TC ID | Gate | 前置 / 操作 | 通过方向 | 一票否决 / 证据边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-CFG-A-001` | Schema | 合法与非法 strict candidate | required/type/version/unknown/duplicate 语义稳定 | 任一 unsafe input 被接受即阻断；不写结果 | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-002` | No fallback | 高优先级 source 注入非法值 | fail-fast，不回退 default/file | silent fallback 或 fake fallback 直接 veto | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-003` | Builder atomicity | B0~B8 各阶段故障注入 | failure dispose prefix、无 entry exposure | partial graph 可调用直接 veto | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-004` | Sensitive no-output | raw/secret/full ref/stack 输入全表面扫描 | safe issue/ref-only 输出 | 任一 artifact/report 泄露直接 veto | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-005` | Profile isolation | Local/CI fixture 与 integration-like 混配 | fake/deterministic 只在 Local/CI | fake 进入 real-like 或 production claim 直接 veto | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-006` | Safety redlines | 逐一尝试 `NC-L2T-001~025` override | 全部 typed reject；设计不变量不可配置 | 任一 override 改变 truth/phase/no-write 直接 veto | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-007` | External truth | ref/endpoint/blocked/health marker 输入 | 只保留 ref/status/blocked surface | ready/delivered/observed/run 推断直接 veto | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-008` | Unknown fence | commit/side-effect ambiguous scripted outcome | unknown/manual marker，无 generic retry | 第二次 side-effect call 或推断结果直接 veto | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-009` | Degraded no-write | stale/rebuilding/unavailable projection/job | 显式 degraded、Query/Job no-write/no-repair | silent fallback 或修 core truth 直接 veto | `EV-CAND-L2T-CFG-A-001` |
| `TC-L2T-CFG-A-010` | Change/rollback | high-risk candidate 变更、撤销和 fix-forward | audit/revalidation/rollback refs 完整 | live patch、旧 candidate 未重验或 compromised ref 复活直接 veto | `EV-CAND-L2T-CFG-A-001` |

### 9.3 Configuration failure-mode cases (`CFG-F`)

每个 failure case 都必须同时断言：typed error/failure class、无 forbidden fallback、无不允许的
写入或外部调用，以及 safe diagnostic。`CFG-F-10` 对应开放 upstream blocker，必须保持 blocked，
不进入 positive readiness 分母。

| TC ID | 失效模式 | 触发 | 正式 oracle | 禁止 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-CFG-F-001` | JSON unreadable/malformed | 文件不可读或语法错误 | fail-fast + value-free issue | 旧配置/default 继续 | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-002` | required section/item missing | 删除 required root/item | fail-fast、无 entry | placeholder/partial graph | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-003` | type/enum/bound/ref invalid | wrong kind、越界、空 ref、无界 policy | typed InvalidTypedValue/entry-job reject | clamp/coercion/string fallback | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-004` | invalid high source | env/file 高优先级值非法 | fail-fast，不回退低源 | silent fallback | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-005` | cross-section conflict | profile/feature/target/job 组合冲突 | CrossSectionConflict/UnsafeOverrideAttempt | 只取一边或顺序依赖 | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-006` | Store/UoW capability mismatch | pair/CAS/transaction capability 缺失 | MissingUnitOfWorkCapability；no graph | split tx/compensating write | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-007` | replay surface insufficient | result/receipt/report surface 缺失 | MissingReplaySurface；不重算 truth | current truth reconstruction | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-008` | sensitive ref invalid | malformed/revoked registry ref | fail-fast + no-output | plaintext/fixture fallback | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-009` | unsupported lifecycle/source | center/admin/hot/reload/LKG source | deterministic reject | hidden reload/LKG | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-010` | external contract open | each `L2T-UP-*` owner/schema/mapping/route missing | blocked-aware/fail-closed | fake success/Available/readiness | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-011` | configured adapter unavailable | scripted Port unavailable | typed Unavailable/degraded by flow | default allow or host bypass | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-012` | visibility unavailable | visibility Port unavailable | Query/entry unavailable; no default visible | inventory/Hub fallback | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-013` | projection stale/rebuilding | D1 state stale/rebuilding/unavailable | explicit degraded; Query no-write | inline rebuild/live fallback | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-014` | handoff timeout no proof | timeout may cross Port boundary | CallOutcomeUnknown/SubmissionOutcomeUnknown + manual | automatic second call | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-015` | optional feature disabled/route blocked | disable peripheral feature | registration skipped/local attempt only; core unchanged | disabling safety/admission/outcome | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-016` | entry/job selector invalid | invalid snapshot/scope/target | current scope rejected; global unchanged | mutate global or prior history | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-017` | bounded Job mixed failure | per-target success/failure mix | Partial/Blocked/Failed `JobReport` with bounded refs | erase successes/repair subject | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-018` | config identity drift | expected/actual safe identity differ | block new assembly + safe diagnostic | raw diff or fake baseline | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-019` | builder stage failure | inject B0~B8 failure | dispose prefix; no bundle | expose partial entry | `EV-CAND-L2T-CFG-F-001` |
| `TC-L2T-CFG-F-020` | unsafe output detected | forbidden field reaches log/report/material | fail-closed output + safe issue | redact-after-persist or exception path | `EV-CAND-L2T-CFG-F-001` |

### 9.4 Cross-field gate cases (`CFG-X`)

| TC ID | Gate | 断言 | 失败 surface | EV族 |
|---|---|---|---|---|
| `TC-L2T-CFG-X-001` | profile/source/Clock/ID | deterministic fixture 仅 Local/CI；source/profile compatible | CrossSectionConflict | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-002` | Store refs + UoW | 七 Store capability 与 one UoW/pair/CAS 相容 | UnsupportedCapability/MissingUnitOfWorkCapability | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-003` | idempotency/replay | result/receipt/report 可 exact replay 且 retention 有界 | MissingReplaySurface | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-004` | job boundary/enabledKinds | enabled 是 allowed 非空子集，无重复/未知 | CrossSectionConflict/job reject | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-005` | projection/jobs/features | 仅在依赖完整时注册 rebuild/status | fail-fast/blocked | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-006` | adapter mode/ref/profile | mode/kind/profile 相容，blocked 不变 Available | BlockedExternalContract/UnsafeOverrideAttempt | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-007` | auth/sandbox/source | auth gap fail-closed、no-host、source gap no-outcome | blocked-aware plan | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-008` | collaboration/target/features | target 与 route/delivery 分离，依赖完整 | route-blocked/fail-fast | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-009` | handoff phase policy | Prepared -> one call -> phase-2；unknown manual | UnsafeOverrideAttempt | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-010` | redaction/diagnostic | policy floor equal-or-stricter，body-free low-cardinality | fail-closed | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-011` | forbidden source/key | no NC override/hot/admin/remote/LKG | UnsafeOverrideAttempt | `EV-CAND-L2T-CFG-X-001` |
| `TC-L2T-CFG-X-012` | total enabled graph | required slots complete；disabled 仅 peripheral | fail-fast before exposure | `EV-CAND-L2T-CFG-X-001` |

## 10. Observability and audit cases

观测测试只验证 L2 自有 safe carrier、埋点和本地审计边界；不把 Observability store、producer、route、
retention 或 readiness 当作已闭合事实。每个 case 都需要检查 body-free、低基数和 local truth first。

| TC ID | 观测切口 | 操作 | 正式 oracle | 禁止 / 边界 | EV族 |
|---|---|---|---|---|---|
| `TC-L2T-OBS-001` | structured log | command/query/consumer/job 各触发 accepted/rejected/blocked/replay | safe ref、state、error、duration 字段与 phase 对称 | raw body/secret/stack/accepted-before-commit | `EV-CAND-L2T-OBS-001` |
| `TC-L2T-OBS-002` | low-cardinality metrics | 注入 actor/subject/request/key/body 变化 | labels 仅 closed kind/result/error/count/duration/freshness | 高基数/正文/credential label | `EV-CAND-L2T-OBS-001` |
| `TC-L2T-OBS-003` | TraceContext/span | 缺 metadata、重复 context、跨 phase 调用 | context 只来自正式 metadata；span 不生成业务 identity | 随机 context/endpoint 推断/span=commit | `EV-CAND-L2T-OBS-001` |
| `TC-L2T-OBS-004` | audit pair | accepted source、no-execution、duplicate、half-pair fault | `ToolInvocationOutcome` 与 `ToolAuditEntry` 同 UoW 成对；duplicate 不追加 | log/metric/Bus ack 补 audit | `EV-CAND-L2T-OBS-001` |
| `TC-L2T-OBS-005` | accepted/rejected/duplicate observation | 各 flow 触发 commit known/unknown、reject、replay | only confirmed local commit emits accepted summary；unknown/manual | marker/observed/delivery 推 accepted | `EV-CAND-L2T-OBS-001` |
| `TC-L2T-OBS-006` | Query/Job no-write fence | spy all Store/UoW/Port and run stale/rebuild/partial | zero write/refresh/external call；Job bounded report only | inline repair/rebuild/subject mutation | `EV-CAND-L2T-OBS-001` |
| `TC-L2T-OBS-007` | status separation | inject Bus/Observation refs missing/stale/conflict | status ref/gap independent；local attempt/outcome immutable | `Delivered`/`Observed` inferred locally | `EV-CAND-L2T-OBS-001` |
| `TC-L2T-OBS-008` | forbidden sweep | scan logs, spans, metrics, audit, receipt, report, material and errors | no raw request/capture/provider body/secret/full ref | encrypting or hashing raw body is not exception | `EV-CAND-L2T-OBS-001` |
| `TC-L2T-OBS-009` | fake/durable parity | same candidate and fault sequence through both adapters | same error/key/digest/redaction/blocked outcome | fake cannot claim external readiness | `EV-CAND-L2T-OBS-001` |

## 11. Veto and non-configurable boundary mapping

### 11.1 `VF-L2T` case matrix

| TC ID | Veto | 操作 | 否决 oracle | EV族 |
|---|---|---|---|---|
| `TC-L2T-VETO-001` | `VF-L2T-001` | 移除/替换任一核心节点或把条件 seam 写成固定外仓时序 | core capability chain 不完整或错误时 fail；不得以外仓 presence 补齐 | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-002` | `VF-L2T-002` | 用 display/builtin/inventory/provider/SDK wrapper 替代 identity/definition | identity/definition authority 仍由 L2 formal contract 持有 | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-003` | `VF-L2T-003` | 复制 Hub registry 或把 visibility 当 authorization | Binding 只保存 typed ref/snapshot/assessment；不得 self-authorize | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-004` | `VF-L2T-004` | 为 caller/carrier 增加第二 invocation/result/error 或吸收 planner | canonical frame 唯一；无 agent loop/orchestration/retry truth | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-005` | `VF-L2T-005` | 缺 authorization/source 或 sandbox-required 时尝试放行/host 直跑 | fail-closed；无 host/direct bypass | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-006` | `VF-L2T-006` | 用 rejected/waiting/marker/ref 伪造 executed/run/receipt/delivery | 当前 oracle 只能是 local disposition/blocked/unknown | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-007` | `VF-L2T-007` | 用 capture/provider/Bus/Obs/checkpoint 替代 normalized outcome/audit | source assessment 后才可形成 local pair | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-008` | `VF-L2T-008` | 将 forbidden body/secret/full ref/evidence 正文送入任一 surface | 四门安全检查和 body-free 必须同时通过，否则无 material | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-009` | `VF-L2T-009` | 让 Bus/Obs/SDK/Runtime 消费结果覆盖或驱动 local recovery | local outcome/audit first；下游只追加独立 ref/gap | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-010` | `VF-L2T-010` | 引入 orchestration、registry、auth、Sandbox、Bus、Obs、SDK/provider truth | owner/依赖裁剪违规即 fail | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-011` | `VF-L2T-011` | late material 原地改写 identity/binding/invocation/outcome/audit/handoff | append assessment/ref/gap；旧事实 immutable | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-012` | `VF-L2T-012` | 将开放 Core/Obs/SDK seam、runtime/event 依赖或 material handoff 写成已闭合 | blocked/candidate/future 保持原状态；依赖类型不增 | `EV-CAND-L2T-VETO-001` |
| `TC-L2T-VETO-013` | `VF-L2T-013` | 引入旧 API/event/error、旧指标、旧签署或 blocker closure 叙事 | historical material 不进入 current oracle；不伪造结果 | `EV-CAND-L2T-VETO-001` |

### 11.2 `NC-L2T-001~025` 逐项映射

| NC ID | 对应 VETO case | 最小断言 / 负向输入 |
|---|---|---|
| `NC-L2T-001` | `TC-L2T-VETO-002` | profile/ref/feature 不能创建或改写 identity、definition、invocation、outcome、audit truth |
| `NC-L2T-002` | `TC-L2T-VETO-010` | 配置不得引入 sibling、反向依赖或第二协作主链 |
| `NC-L2T-003` | `TC-L2T-VETO-002` | Clock/ID adapter 不得改变 semantic identity/revision 规则 |
| `NC-L2T-004` | `TC-L2T-VETO-011` | 配置/reload/alias 不得切换 current definition |
| `NC-L2T-005` | `TC-L2T-VETO-003` | availability/feature 不得改写 Binding mode/history |
| `NC-L2T-006` | `TC-L2T-VETO-003` | Hub visibility/inventory/fake 不得推导 authorization allow |
| `NC-L2T-007` | `TC-L2T-VETO-004` | caller/carrier 必须共享 canonical invocation/result/error |
| `NC-L2T-008` | `TC-L2T-VETO-008` | raw body/secret/capture/provider response 永不进入 local surface |
| `NC-L2T-009` | `TC-L2T-VETO-005` | admission gate 不可关闭或被 timeout/retry 绕过 |
| `NC-L2T-010` | `TC-L2T-VETO-005` | auth missing/stale/conflict/unverifiable 均 fail-closed |
| `NC-L2T-011` | `TC-L2T-VETO-003` | requirement/auth/Sandbox requirement 三 owner 不合并 |
| `NC-L2T-012` | `TC-L2T-VETO-005` | Sandbox-required 不得 host/direct bypass |
| `NC-L2T-013` | `TC-L2T-VETO-006` | local attempt/ref/health 不得推导 accepted/run/receipt |
| `NC-L2T-014` | `TC-L2T-VETO-007` | source 必须经 authority/correlation/mapping assessment 后 normalized |
| `NC-L2T-015` | `TC-L2T-VETO-007` | 每 invocation 只能有一个 immutable terminal outcome |
| `NC-L2T-016` | `TC-L2T-VETO-007` | outcome/audit 必须同一 UoW 原子成对 |
| `NC-L2T-017` | `TC-L2T-VETO-008` | safe handoff 四门缺一即无 material |
| `NC-L2T-018` | `TC-L2T-VETO-009` | submission/delivery/observation 不参与 local terminal |
| `NC-L2T-019` | `TC-L2T-VETO-009` | Bus delivery 与 Observation status 分离 |
| `NC-L2T-020` | `TC-L2T-VETO-009` | Query/Consumer/Job 不得越过 no-write/no-repair fence |
| `NC-L2T-021` | `TC-L2T-VETO-011` | gap resolution 需 subject owner repair + L2 reread |
| `NC-L2T-022` | `TC-L2T-VETO-011` | stale/unavailable projection/report 不替代 core truth |
| `NC-L2T-023` | `TC-L2T-VETO-011` | 状态词表、合法迁移、append-only/immutable 不可改 |
| `NC-L2T-024` | `TC-L2T-VETO-012` | candidate/pending/blocked/fake/ref 不等 implementation ready |
| `NC-L2T-025` | `TC-L2T-VETO-010` | 不引入 runtime planning/orchestration/retry/recovery/DLQ truth |

## 12. Step 6 停审、诊断与跨用例审计

### 12.1 当前材料问题诊断

| 位置 | 诊断 | 修正 |
|---|---|---|
| 原 §1 状态 | 在配置/观测/否决用例落盘前提前声明 accepted | 改为 in_progress，完成审计后再收口 |
| 原 §4.1 family 表 | `CFG-T/A/F/X`、OBS、VETO 只有编号范围，没有逐用例 oracle | 新增 §9~§11 详细矩阵 |
| 原 §8.4 | 错误族未显式关联 `CFG-F` 与 blocker negative | 新增 `CFG-F-010` 和审计规则 |
| 原文件末尾 | 缺少 SOP 要求的改动诊断、取舍、回填草稿、停审记录 | 新增本节 §12~§16 |

### 12.2 P0 测试切口逐项停审

| 切口族 | 设计来源 | 正向 / 负向 | 数据前置 | 断言 / phase | planned EV | 结论 |
|---|---|---|---|---|---|---|
| FOUNDATION/CONTRACT/BIND/INV | `03` §6~§9、§15.2~§15.4 | 有效构造、缺失、冲突、重放 | typed fixture、CAS、scope | canonical state、zero-write、无 external Port | 对应 `EV-CAND-L2T-*` | 通过 |
| PRE/OUTCOME/HANDOFF | `03` §8~§12、§15.3~§15.7 | eligible、blocked、known failure、unknown | auth/sandbox/source scripted resolution | Prepared/one-call/phase-2、pair atomicity | 对应 EV | 通过；provider positive 条件化 |
| QUERY/CONSUMER/CONT/JOB | `03` §7~§9、§15.4~§15.6 | found、degraded、duplicate、partial | read surfaces、envelope、bounded scope | query zero-write、IF-03 唯一重入、Job no-repair | 对应 EV | 通过 |
| STATE/TX/CONC/ERR | `03` §9~§12、§15.7 | 合法/非法、故障注入、并发 | state fixtures、UoW/Store spy | enum transition、CAS、unknown/manual | 对应 EV | 通过 |
| CFG/CFG-T/A/F/X | `04` §9~§12、`03` §13 | valid profile、strict negative、blocked | candidate/profile/fault fixtures | V0~V8、B0~B8、no fallback、no output | 对应 EV | 通过；不声明实现 |
| OBS | `03` §14~§15.8 | commit/reject/replay/degraded | safe event and telemetry fixtures | low-cardinality、pair、status separation、redaction | `EV-CAND-L2T-OBS-001` | 通过；不声明 Obs readiness |
| VETO/NC | `00` §14.3、`03/04` redlines | 每个 NC 负向 override | forbidden key/feature/profile inputs | typed reject、truth/phase/no-write 不变 | `EV-CAND-L2T-VETO-001` | 通过 |

### 12.3 跨用例断言与 phase 审计

| 审计项 | 结果 | 处理规则 |
|---|---|---|
| TC ID 重复 | 未发现重复；family 编号按段连续 | 新增用例必须先占用未使用 family/序号 |
| EV family 冲突 | 未发现 planned EV family 冲突 | EV 只表示类别；Step 13 再绑定 run-specific index |
| 状态/错误命名漂移 | 未发现；使用 `03` 正式 enum/error 名称 | 禁止引入旧 `Completed`、旧 MCP/host 状态 |
| Query no-write | 所有 Query/OBS/CFG degraded cases 共用 zero-write predicate | 任何 refresh/Port/UoW 写入均 fail |
| Prepared/unknown phase | CF-10、OF-01~04 均限制 phase-1 marker -> 一次 Port -> phase-2 | unknown 不自动重试，不写 external accepted |
| outcome/audit pairing | OUTCOME、TX、OBS、NC-L2T-016 都断言同 UoW 成对 | half pair 映射 `IntegrityFailure`/unknown |
| blocker positive closure | `L2T-UP-001~009` 只出现在 blocked/unavailable/unknown negative | 不计入 P0 positive pass 分母 |
| VETO/NC 完整性 | 13 VETO 覆盖 25 NC，§11.2 逐项映射 | 新红线必须同时更新 VETO、NC 映射和 EV |
| 后续 phase 越界 | 未发现 `Delivered`/`Observed`/provider accepted/run/receipt/evidence/signoff 作为当前 oracle | 只保留独立 ref/unknown/gap |

### 12.4 改动前后对比与设计取舍

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置验证 | 仅有 family 编号 | 逐项覆盖 strict parse、source、profile、failure、cross-field 和 builder | 04 的可落码配置契约必须可直接测试 |
| 观测验证 | 仅列 `OBS-001~009` 范围 | 每个 OBS 有输入、safe oracle、禁止项和 planned EV | 防止把观测后端误当 L2 truth |
| 否决验证 | 仅按 VF 编号 | VF case + 25 条 NC 逐项映射 | 06 必须能直接消费边界否决证据 |
| Step 状态 | 提前 accepted | 先 in_progress，审计后才 accepted | 防止台账与中间产物不同步 |

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按设计切口分 family，横切 CFG/OBS/VETO 独立 | 能回指 03/04、支持分层和证据归档 | case 数量较多 | 采用 |
| 复用旧 `TC-001~012` 并补新边界 | 文件短、迁移成本低 | 旧语义、旧状态和旧结果会污染 oracle | 拒绝，旧文件仅 historical_material |
| 只保留 happy path，负向交给 06 | 书写快 | 无法验证 fail-closed、unknown 和 no-write | 拒绝，P0 负向必须在 05 预留 |

### 12.5 回填草稿（正式 05 §6）

> 校准来源：
> - `design-calibration/05_test_plan_step_06_cases.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“Foundation、合同、Binding 与 Invocation cases”“Configuration cases”“Observability and audit cases”和“Veto and non-configurable boundary mapping”。

正式测试方案 §6 将按 FOUNDATION、合同/Binding/Invocation、前置/Outcome/Handoff、Query/Consumer/Continuation/Job、状态/事务/并发/错误、配置、观测和 VETO 八个切口组装用例。每个 P0 用例包含稳定 TC ID、设计来源、数据前置、操作、正式字段/状态/错误 oracle、负向边界、自动化候选和 planned EV family。`CallOutcomeUnknown`、`SubmissionOutcomeUnknown`、`CommitOutcomeUnknown` 保持人工 fence；Query 维持 zero-write/zero-refresh/zero-external-Port；Job 维持 bounded/no-repair；外部 positive provider/readiness 只在 blocker 闭口后条件启用。

### 12.6 待确认事项

| 事项 | 影响 | 处理 |
|---|---|---|
| `L2T-UP-001~009` owner/schema/mapping/route/client closure | P1 positive suite 是否可执行 | 保持 blocked/unavailable/unknown；不影响 P0 negative/local cases |
| 实现仓测试框架、真实 entry 名称 | Step 9 脚本实现 | 当前只定义 planned suite/script contract，不写命令事实 |
| 06 的最终 AC/EV authority | Step 13 EV 绑定 | 使用 planned EV family，待 06 重建时再绑定正式 AC |

### 12.7 进入下一步条件

- [x] 每个 P0 测试切口至少有正向和关键负向/边界用例。
- [x] CFG-T/A/F/X、OBS、VETO 已逐项具备 oracle 和 planned EV。
- [x] `NC-L2T-001~025` 已逐项映射到 VETO case。
- [x] TC/EV、状态/错误命名、phase boundary、Query no-write、outcome/audit atomicity 和 blocker 语义审计通过。
- [x] 未创建真实 run、artifact、report、evidence alias、测试结果或验收签署。
- [x] 可以创建 Step 7 中间产物；正式 `05-测试方案.md` 仍保持锁定。

## 13. Step 6 完成记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_06 / proceed_to_step_07` |
| 停审时间 | 2026-08-06（设计审查记录；非测试执行时间） |
| 修改来源 | `03` §7~§15、`04` §9~§12、`00` §14.3；旧 05/06/README 未继承 |
| 上游 blocker | `L2T-UP-001~009` 仍 open；正向 provider/readiness 不计入当前 P0 |
| 正式文档写入 | 未写；Step 15 前保持锁定 |
| 下一步 | Step 7 测试数据设计 |
