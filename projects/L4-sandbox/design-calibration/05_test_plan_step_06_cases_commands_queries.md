# Step 6 分件 A. Shared Carrier、Command 与 Query 用例矩阵

> 父Step: `05_test_plan_step_06_cases.md`
> 正式来源: `03-详细设计.md` §7~§12;`03_ddd_step_08_protocol_contracts.md` §10~§12;`03_ddd_step_09_function_flows.md` §9 / §14 / §15
> 生成日期: 2026-07-12
> 状态: reviewed_passed_with_step_06
> 边界: 本分件创建正式测试设计ID,不表示用例已实现 /执行。前置条件只定义formal state / port outcome class;fixture名称、builder、seed和清理留Step 7。`PER-SBX-*`仍是planned evidence requirement,不是EV、artifact或结果。
> Step 15 5.10回写: 2026-07-13 将`TC-SBX-CMD-004`中的旧候选名`CoherentBoundaryStatus`校正为正式`BoundaryCoherenceStatus`;用例ID、语义与数量不变。

---

## 1. 用例写法与共用断言

| 项 | 固定口径 |
|---|---|
| 用例ID | `TC-SBX-CTR-*`、`TC-SBX-CMD-*`、`TC-SBX-QRY-*`是Step 6正式测试设计ID,后续实现不得改号复用成其他命题。 |
| 主线前置 | 使用正式对象状态、version、typed ref和port outcome描述;Step 7再分配可重复数据集。 |
| Command accepted | truth group、formal audit、canonical relay、projection stale、stored result、idempotency complete、truth cursor同一UoW提交。 |
| Command rejected | 不出现accepted truth或backend / handoff副作用;replayable rejection只能保存正式safe result。 |
| Query | 不开启write UoW,不save truth / audit / relay / stale marker,不refresh / rebuild / retry / cleanup / release。 |
| 自动化 | L1 / L2 / L4必须自动化;依赖port outcome的场景使用deterministic controlled adapter,不声称真实backend conformance。 |

## 2. Shared public carrier与metadata用例

| 用例ID | 场景 /前置 | 输入 /操作 | 预期结果与关键断言 | 层级 | CUT / PER |
|---|---|---|---|---|---|
| TC-SBX-CTR-001 | 全部public DTO family有合法最小值 | 对Command / Query / Consumer / Event / Job carrier做encode-decode roundtrip | required字段、enum、typed ref family、optional语义保持;无domain-only或raw body字段 | L1 | CUT-SBX-001;PER-SBX-001 |
| TC-SBX-CTR-002 | 每类typed ref各有异族ref | 逐required ref字段替换为错误family或空值 | `ContractError::InvalidCarrier` -> `SandboxPublicErrorKind::Validation`;entry拒绝且0业务写 | L1+L4 | CUT-SBX-001/026;PER-SBX-001/026 |
| TC-SBX-CTR-003 | 合法command metadata基线 | 逐项缺`protocol_metadata` / `actor_context` / `idempotency_key_ref`,或把repository version放入`expected_version`之外字段 | `ApiError::InvalidEntryMetadata` / `Validation`;service与port均未调用 | L1+L4 | CUT-SBX-002/031;PER-SBX-002/031 |
| TC-SBX-CTR-004 | 同一operation具有语义相同 /不同的输入排列 | canonicalize并计算request digest | 等价输入digest相同;任一正式ref / operation / channel / spec变化digest不同;trace / retry counter不入truth key | L1+L2 | CUT-SBX-002/024;PER-SBX-002/024 |
| TC-SBX-CTR-005 | page、truth、reference marker cursor和version均存在 | 交叉替换`page_request.cursor`、`source_cursor`、expected version、timestamp | typed validation或`CursorInvariantViolation`;不得扫描storage或猜测转换 | L1+L3 | CUT-SBX-002/023;PER-SBX-002/023 |
| TC-SBX-CTR-006 | internal error含synthetic raw marker | 映射`SandboxPublicErrorDto`、receipt、report和safe reason | 只保留error kind、safe reason / source / trace opaque ref和retry hint;raw SDK / SQL / body / stack均不存在 | L1+L4 | CUT-SBX-001/026/032;PER-SBX-001/026/032 |

## 3. Command用例矩阵

| 用例ID | 协议 /场景 | 前置条件 | 输入 /操作 | 预期结果 | 字段 /状态 /副作用断言 | 层级 / PER |
|---|---|---|---|---|---|---|
| TC-SBX-CMD-001 | `OpenControlledExecutionContext` accepted | body-free source refs可解析;responsibility anchor授权 | 提交合法metadata、source refs、summary set和guard ref | command `Accepted` | `ControlledExecutionIntakeStatus::Accepted`;identity `Active`;返回context / identity / resolution / audit refs;accepted组同UoW | L2+L4;PER-SBX-003/009/014/022 |
| TC-SBX-CMD-002 | `OpenControlledExecutionContext`拒绝矩阵 | 无既有context truth | 分别触发required ref缺失、resolver conflict、actor越scope、forbidden body marker | `Pending` / `Rejected`或对应`ReferenceUnresolved` / `NotAuthorized` / `ForbiddenExternalBody` | 不补造identity;rejected不得转Accepted;resolver / body错误不产生launchable context | L1+L2+L4;PER-SBX-003/009/014/026 |
| TC-SBX-CMD-003 | `EstablishExecutionBoundary` coherent主线 | context `Accepted`;identity `Active`;capability `Fresh`;四维要求同代可满足 | 提交resource / filesystem / network / process完整要求 | command `Accepted` | decision `Established`;boundary `Coherent`;handle `Active`;lease创建;四维与identity / generation绑定且无weak fallback | L2+L3+L4;PER-SBX-004/009/015/022/031 |
| TC-SBX-CMD-004 | `EstablishExecutionBoundary`整体拒绝 | context存在;capability stale / unsupported或任一维不可落实 | 分别缺维度、注入unsupported、stale summary、adapter unavailable / partial outcome | `Pending` / `Rejected` / `Failed` | 不出现`BoundaryCoherenceStatus::Coherent`;partial handle不得可用;`WeakBoundaryFallbackRejected` / `BoundaryRejected`安全映射 | L1+L2+L3;PER-SBX-004/015/026/034/036 |
| TC-SBX-CMD-005 | `EvaluatePolicyExecution` accepted | context accepted;policy / authorization body-free summary fresh;高风险marker已裁定 | 提交完整policy refs和high-risk markers | command `Accepted` | applicability与decision正式refs存在;decision `Accepted`;每个high-risk action有正式decision;不保存policy body | L1+L2+L4;PER-SBX-005/009/016/022 |
| TC-SBX-CMD-006 | `EvaluatePolicyExecution` fail-closed矩阵 | context存在 | 分别让policy missing / stale / conflicted / unsafe,authorization缺失或high-risk unknown | command `Rejected` / `Pending`;`PolicyFailClosed` | `PolicyExecutionDecisionStatus`不为Accepted;high-risk不为Allowed;无launch / backend调用 | L1+L2+L3;PER-SBX-005/016/021/026 |
| TC-SBX-CMD-007 | `StartControlledExecutionRun` bounded launch | context accepted;boundary coherent;handle active;policy accepted | 提交body-free launch summary | command `Accepted` | run进入正式started/running路径并绑定context / boundary / handle / policy;只调用`IsolationBackendPort`一次;不拥有tool semantics / agent loop truth | L2+L3+L4;PER-SBX-006/009/017/031 |
| TC-SBX-CMD-008 | `StartControlledExecutionRun` guard拒绝 | 至少一项为boundary非coherent、handle released/orphan、policy非accepted或launch含raw marker | 尝试启动 | `BoundaryRejected` / `PolicyFailClosed` / `AdapterUnavailable` / `ForbiddenExternalBody` | backend launch调用0;run不得伪成功;failure surface安全且guard优先 | L1+L2+L3;PER-SBX-005/007/017/026 |
| TC-SBX-CMD-009 | `RecordCaptureResult` complete / partial | run处于允许capture的正式状态;`CaptureCollectionPort` 返回body-free candidate | 分别记录complete和partial capture | command `Accepted` / `Degraded` | `CaptureFact::record(...)` 直接定格 `CaptureFactStatus::Complete` / `Partial`;无`Pending`;不原地改写;material / observability refs来自candidate;formal audit同UoW | L2+L3+L4;PER-SBX-006/009/017/029 |
| TC-SBX-CMD-010 | `RecordCaptureResult`错误边界 | run missing / illegal terminal;complete但material空;summary含raw body;adapter failed | 记录capture | `ReferenceUnresolved` / `Validation` / `ForbiddenExternalBody`或Failed | 不把partial / failed映射Complete;不回写run成功;无raw material进入truth / audit / relay | L1+L2+L3;PER-SBX-006/017/026/029 |
| TC-SBX-CMD-011 | `OpenMaterialHandoff` accepted | capture complete / partial且refs存在;fixed target plan完整且无重复 | 打开material / observability handoff | command `Accepted` / `Pending` | `HandoffFact::open(...)`绑定capture、source material和fixed target plan;一次创建完整`Pending` progress set;聚合状态机械派生;opening内`deliver` / `inspect_same_attempt`调用0;capture truth不变 | L2+L3+L4;PER-SBX-006/009/017/020 |
| TC-SBX-CMD-012 | `OpenMaterialHandoff`计划拒绝不回滚 | capture已提交;target plan为empty / duplicate / mismatch或lineage不完整 | 尝试打开handoff | `Validation` / `ReferenceUnresolved` safe surface | invalid opening不创建半套progress set;delivery port调用0;`CaptureFactStatus`、material refs和既有accepted audit不回滚;不伪造target / observability ref | L1+L2+L3;PER-SBX-006/017/026/035 |
| TC-SBX-CMD-013 | `SubmitSandboxControl` accepted | context / run存在;control source trusted;conflict guard匹配 | 提交合法kill / cancel等formal control | command `Accepted` | 只创建一个`ControlFact`;run按正式guard单调变化;可产生failure seed但不执行runtime recovery / replay | L1+L2+L4;PER-SBX-007/009/018/025 |
| TC-SBX-CMD-014 | `SubmitSandboxControl`冲突 /非法 | control kind unknown、guard缺失、source mismatch或目标已terminal | 提交control | `Rejected` / `VersionConflict` / `Validation` | 不创建第二control truth;不复活run;不绕cleanup / redline;safe audit保留 | L1+L2+L3;PER-SBX-007/018/025/026 |
| TC-SBX-CMD-015 | `ClassifySandboxFailure`已知来源 | context存在;policy / backend / capture / handoff / control marker至少一项正式匹配 | 提交classification | command `Accepted` | `FailureClassificationStatus::Classified`;`SandboxFailureKind`非猜测;source refs与safe reason可回链;failure relay同UoW | L1+L2+L4;PER-SBX-007/009/018/032 |
| TC-SBX-CMD-016 | `ClassifySandboxFailure`未知 /错配 | source markers空、run / capture错配或backend inspect unavailable | 尝试classification | `Pending` / `Rejected` / `Failed`,不得success | `Unknown`保持unknown / pending;不改run / capture truth;raw backend error不进入public surface | L1+L2+L3;PER-SBX-007/018/026/035 |
| TC-SBX-CMD-017 | `EvaluateCleanupReadiness` allowed decision | capture / handoff完成;无redline;investigation与guard证据齐全 | 评估cleanup readiness | command `Accepted`;guard `Allowed` | 只保存`CleanupGuard`;不调用`release_environment`;handoff / capture / evidence refs保留 | L1+L2+L4;PER-SBX-007/009/018/022 |
| TC-SBX-CMD-018 | `EvaluateCleanupReadiness`保守阻断 | capture缺失、handoff pending、investigation缺失、redline active或guard ref缺失 | 评估cleanup readiness | guard `PendingEvidence` / `PendingInvestigation` / `Blocked` | release调用0;lease / handle不被删除或Released;`CleanupGuardRejected`映射安全 | L1+L2+L3;PER-SBX-007/018/026/035 |
| TC-SBX-CMD-019 | `RecordRedlineContainment` contained | detector source、context / boundary匹配;containment和investigation target可建立 | 记录redline | command `Accepted`;containment `Contained`或`HandoffPending` | cleanup guard同步blocked;正式redline / audit / relay可回链;不得advisory-only | L1+L2+L4;PER-SBX-007/009/018/032 |
| TC-SBX-CMD-020 | `RecordRedlineContainment`红线拒绝矩阵 | context / boundary错配、kind unknown无safe reason、handoff port unavailable或尝试直接release | 记录或释放redline | `Quarantined` / `PolicyFailClosed` / pending safe surface | containment不被写成Released;launch / cleanup / release继续阻断;raw detector body不保存 | L1+L2+L3;PER-SBX-007/018/026/035 |

## 4. Query用例矩阵

| 用例ID | Query /场景 | 前置 /操作 | 预期surface | 强制断言 | 层级 / PER |
|---|---|---|---|---|---|
| TC-SBX-QRY-001 | `GetSandboxExecutionStatus` visible | 可见context snapshot;按context ref查询 | `Visible`且返回正式status view | refs / status / cursor来自snapshot;write UoW=0 | L2+L4;PER-SBX-010/019 |
| TC-SBX-QRY-002 | execution missing / restricted / stale | 分别使用missing、越scope、stale snapshot | `Unavailable` / `NotVisible` / `Stale` | 不refresh context、不append audit;restricted不泄露view | L2+L4;PER-SBX-010/019/026 |
| TC-SBX-QRY-003 | `GetBoundaryStatus` context branch | context projection含established / pending decision | 返回对应`BoundaryStatusView` | 不调用capability / backend;decision与handle refs不拼造 | L2+L4;PER-SBX-010/015 |
| TC-SBX-QRY-004 | boundary direct selector未开放 | 只给direct boundary ref且无正式index / projection | `Validation` / `MissingProjection` | 不scan truth store、不establish boundary、write=0 | L2+L3+L4;PER-SBX-010/023 |
| TC-SBX-QRY-005 | `GetPolicyDecisionSummary` accepted / rejected | 可见policy snapshot | 返回Accepted / Rejected / FailClosed正式summary | 不读取DSL / approval body;不refresh policy | L2+L4;PER-SBX-010/016 |
| TC-SBX-QRY-006 | policy stale / unavailable | reference state stale或source unavailable | `Stale` / `Degraded` / `Unavailable` | 不把stale映射allow;write / policy port call=0 | L2+L4;PER-SBX-010/019/026 |
| TC-SBX-QRY-007 | `GetCaptureSummary` complete / partial / failed | 各状态capture snapshot | 对应正式surface与material refs | 不读取artifact / output body;refs保持body-free | L2+L4;PER-SBX-010/017 |
| TC-SBX-QRY-008 | completed run但capture缺失 | run snapshot存在,capture缺失 | `Degraded`;无capture的非terminal run可`Empty` | 不生成CaptureFact、不调用capture port | L2+L3;PER-SBX-010/019 |
| TC-SBX-QRY-009 | `GetMaterialHandoffStatus` delivered / retryable / failed | handoff snapshot存在 | 对应`MaterialHandoffStatusView` | 不调用handoff port;capture status不变 | L2+L4;PER-SBX-010/017 |
| TC-SBX-QRY-010 | handoff missing / pending | missing或pending snapshot | `Missing` / `Pending` / `Degraded` | retry调用0;不拼handoff ref | L2+L4;PER-SBX-010/019 |
| TC-SBX-QRY-011 | `GetFailureControlStatus` classified / conflict | safety snapshot存在 | classified / pending input / conflict正式surface | `Unknown`不映射success;不调用classify flow | L2+L4;PER-SBX-010/018 |
| TC-SBX-QRY-012 | failure/control restricted / missing | 不可见或snapshot缺失 | `NotVisible` / `Unavailable` | 不泄露safe reason之外detail;write=0 | L2+L4;PER-SBX-010/026 |
| TC-SBX-QRY-013 | `GetCleanupReadiness` allowed / blocked | cleanup guard snapshot存在 | `Allowed` / `Blocked` / pending evidence / investigation | backend release调用0;lease / handle不变 | L2+L4;PER-SBX-010/018 |
| TC-SBX-QRY-014 | cleanup projection缺失 | 缺snapshot / projection | `MissingProjection` / `Degraded` | 不评估guard、不mark stale、不release | L2+L3;PER-SBX-010/019 |
| TC-SBX-QRY-015 | `GetRedlineContainmentStatus` detected / contained | redline snapshot存在 | detected / contained / handoff pending / blocked | no release;cleanup guard不变 | L2+L4;PER-SBX-010/018 |
| TC-SBX-QRY-016 | redline restricted / missing | actor越scope或snapshot缺失 | `NotVisible` / `Unavailable` | 不泄露redline source detail;不调用investigation port | L2+L4;PER-SBX-010/026 |
| TC-SBX-QRY-017 | `GetSandboxReadProjection` fresh / stale | 指定现有projection ref | `Fresh` / `Stale` view | context-only不拼ref;不rebuild / mark stale | L2+L3+L4;PER-SBX-010/019/023 |
| TC-SBX-QRY-018 | projection missing / rebuilding | repo返回missing或rebuilding | `MissingProjection` / `Rebuilding` / `Degraded` | snapshot builder与write UoW调用0 | L2+L3;PER-SBX-010/019 |
| TC-SBX-QRY-019 | `GetDerivedInspectPreviewTrend` fresh / stale | derived ref存在 | fresh / stale body-free view | derived只读;不升格execution / artifact truth | L2+L4;PER-SBX-008/010/019 |
| TC-SBX-QRY-020 | derived failed / missing | derived repo返回failed / missing | `Failed` / `Empty` / `Degraded` | 不触发maintenance;不创建FailureClassification | L2+L3;PER-SBX-008/010/019 |
| TC-SBX-QRY-021 | `GetBackendCapabilityComparison` supported / unsupported | comparison projection存在 | supported / unsupported正式surface | 不建立boundary;不把comparison当资格 | L2+L4;PER-SBX-010/019 |
| TC-SBX-QRY-022 | capability stale / unavailable | projection stale或adapter unavailable | `Stale` / `Unavailable` / `Degraded` | backend refresh调用0;不得allow launch | L2+L3;PER-SBX-010/019/026 |
| TC-SBX-QRY-023 | `GetSandboxReconciliationReport` clean / issues | report ref存在 | `Clean` / `IssuesFound`与finding refs | 不修truth / projection;只读stored report | L2+L4;PER-SBX-010/019 |
| TC-SBX-QRY-024 | scope-only latest selector未开放 | 只给scope且无latest index,或report degraded | `Validation` / `Degraded` | 不run reconciliation、不scan report store | L2+L3+L4;PER-SBX-010/023 |
| TC-SBX-QRY-025 | `GetSandboxAuditTrace`分页 | 可见subject有多页trace | first / next / empty page正确 | page cursor不等于truth cursor;顺序稳定;不append | L2+L3+L4;PER-SBX-010/023/032 |
| TC-SBX-QRY-026 | audit restricted / invalid cursor | subject不可见或cursor异族 | `Restricted` / `Validation` | 不泄露item;不把cursor猜成version;write=0 | L1+L2+L4;PER-SBX-010/023/026 |

## 5. 本分件停审

| 审查项 | 结论 | 后续边界 |
|---|---|---|
| Shared carrier / metadata / cursor是否有正式负向 | 通过 | Step 7分配typed carrier数据;Step 9绑定suite |
| 10 Command是否逐项有主线与关键拒绝 | 通过,20 /20用例 | adapter场景只证明P0-C contract,不证明真实隔离 |
| 13 Query是否逐项有可见 /降级与0 write断言 | 通过,26 /26用例 | write-audit实现方式留Step 9 |
| 是否提前定义fixture /环境 /EV /执行结果 | 否 | 仅formal state / outcome前置与PER |
| phase边界 | 通过 | query不修复;command不拥有tools semantics、runtime loop或下游truth |
