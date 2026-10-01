# L5-chat 05 · Step 15 参考

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step14；05 SOP Step15与书写规范5.15；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

15章、P0/数据/环境/gate/EV、命名/phase及06消费是否闭口？§15.2十类表与正反例逐项核对；正式正文取结构化产物并去过程语句。

## 4. 当前文档问题诊断

正式装配需清除过程语气、相对链接错误、host-unit单引擎与report前后检查依赖冲突；BASE001与真实集成缺口不能设计关闭。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 正式装配需清除过程语气、相对链接错误、host-unit单引擎与report前后检查依赖冲突；BASE001与真实集成缺口不能设计关闭。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

完成十类跨文档复核，保留所有P0动作/断言/矩阵/schema与风险；装配十五章来源入口，删除旧05后重建同一路径，不创建替代正式文档。

## 7. 结构化中间产物

### 15.1 正式来源与后续消费者

- [00需求文档](../00-需求文档.md)：当前F/BR/数据类别/NFR与实际AC及七条否决。
- [01架构设计](../01-架构设计.md)、[02概要设计](../02-概要设计.md)：模块与owner边界、Desktop-first、五tab与三层流程/目录。
- [03详细设计](../03-详细设计.md)：对象、43protocol/flow、17主体、12enum、15error、CAS/配置/host。
- [04配置设计](../04-配置设计.md)：8域14字段、6profiles、12cuts、来源/default/bound。
- [06验收标准路径](../06-验收标准.md)：本轮not_started；历史内容不作本文输入。后续承接实际TC/EV与proof scope。
- [测试SOP](../../../standards/document/测试方案讨论流程_SOP.md)、[测试书写规范](../../../standards/document/测试方案书写规范.md)。
- [中间产物规范](../../../standards/document/设计文档讨论中间产物规范.md) §5.10、[真相源闭环](../../../standards/document/设计真相源闭环与可落码性标准.md) §2.15/§7。
- [设计通则](../../../standards/document/设计文档编写通则.md)、[全局依赖裁剪](../../../standards/document/全局项目依赖关系与裁剪规则.md) §4.1。
- [05流程](05_test_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md)、[03测试切口](03_ddd_step_16_test_cuts.md)。
- SDK及Conversation/Identity/Process/Work/Governance/Artifact/Workspace/Member/Runtime/Observability当前owner正式文档与台账，阅读记录见项目台账；Governance05仅参考设计粒度，L6-bridges未停审设计不输入。
- 工具正式文档：Vitest（https://vitest.dev/guide/）、Testing Library（https://testing-library.com/docs/react-testing-library/intro/）、Playwright（https://playwright.dev/docs/intro）、Tauri2（https://v2.tauri.app/）、RFC8785（https://www.rfc-editor.org/rfc/rfc8785）。仅工具族/规范选择，非已安装或版本验证。

### 15.2 跨文档一致性复核

#### 15.2.1 真相源表

| 事实 | 真相源 | 消费者 | 冲突处理 |
|---|---|---|---|
| F/BR/NFR/真实AC | 00 §9～14 | 05追溯→06/07 | BASE001只open，不造AC |
| owner/依赖/产品结构 | 01/02 | suite与realgate | UI不能建立ownertruth |
| carrier/protocol/flow/error | 03 §5～8/§11 | 216TC及builders | 所有类型回源，不另定义客户端对象 |
| 状态/条件字段/CAS | 03 §9/§10/§12 | 17主体三类矩阵 | 无ACK或旧generation确认 |
| 八域14配置/6profiles | 04 §6～12 | CFG24与runcontext | alias合法≠bound，例值非预算 |
| 测试TC/variant与证据DTO | 05 §6/§13 | future runner/06/07 | planned预约不是实际EV |
| phase/commit与验收 | future06/07 | acceptance handoff | waiting，05不创造实现事实 |

#### 15.2.2 字段闭环表

| 对象/字段 | 类型/来源 | 构造入口/输入 | 缺失/不合格处理 | planned TC / EV |
|---|---|---|---|---|
| RouteContext actor/scope/context | 03 typedExternalHandle，项目/目录context可null；formalentry | QualifiedEntryResolution→正式factory | authority_missing，不造Conversation | TC-PROTO-009/010 / EV-UNIT-003 |
| ClientConsumptionContext source/target/generation/parent/query | 03正式source/current注册slot/局部代次 | ConsumptionRequest/Factory→CASchecks | context_changed，原slot不改current | TC-CONC-006/007/009 / EV-UNIT-002, EV-UI-002 |
| DraftState draftRef/revision/text/reply/attachments | localid/用户输入/正式safe refs | DraftFactory/ConversationIntentInput | invalid/blocked，稿只内存 | TC-PROTO-001/002/027/028 / EV-UNIT-001, EV-UNIT-004 |
| CommandAttempt association/Gate/action/result | SDKpreparedassociation/GovernanceInput/formalresult | AttemptFactory/reserveDispatch/applyResult | 缺关联不dispatch，缺authority不terminal | TC-PROTO-001～004/051/052 / EV-UNIT-001 |
| Page VM provenance/freshness/visibility | 各owner safe view/opaqueversion/currentcontext | namedfactory/mapper→CAS | safe partial/stale/blocked，隐藏refs清 | TC-PROTO-011～048 / EV-UI-001, EV-UI-002, EV-UI-003 |
| ProjectNavigation project/stage/node/parent | safe Process refs/parent版 | current模型选择 | 旧parent/hidden拒绝 | TC-PROTO-083/084, TC-CONC-008 / EV-UI-002 |
| root/patch expected/checks | LocalVersion/rootread+原slot与incoming | ClientStatePort.compareAndSet | 无checks/错版原patch全不写 | TC-CONC-001/006/009/010 / EV-UNIT-001, EV-UNIT-002, EV-UNIT-004 |
| LocalProjection key/partition/locator/localVersion | localtypedid/SDKsafelocator/repo版 | factory/versionedmemorysave | 无serializerblocked，不durable | TC-PROTO-025/026/075～080 / EV-UNIT-004, EV-UNIT-002 |
| DiagnosticContext六字段 | requestId/sessionEpoch/category/reason/userRequested/platform | typedcaller→factory→唯一DiagnosticPort | extra拒绝/defaultdisabled/unknown | TC-PROTO-063～066/081/082 / EV-UNIT-005 |
| hostrequest origin/window/kind | trustedhostpolicy，非ordinaryJSON | HostBoundaryGuard | unknownorigin/window/permission拒绝 | TC-CFG-011/012 / EV-NATIVE-001 |
| ClientConfig全部14字段 | 04模块映射/批准source；三safe缺省 | strict loader→immutable flat14 | required/range/crossfield拒绝，零halfroot | TC-CFG-001～024 / EV-UNIT-006, EV-NATIVE-001, EV-UI-002, EV-UNIT-005 |
| EvidenceIndex items/TC/scope/digest | 实际machine report，05test-privateDTO | report writer schema/digest/map | 无run不生成，缺参数blocked | TC-REPORT-001～007 / EV-REPORT-001 |

全字段schema继续回03原卡与04逐字段，测试每required/conditional字段负向参数见§6.4，不以本关键字段表缩减对象。

#### 15.2.3 DTO/Event/Job到对象构造闭环

| 输入族 | 目标 | 必填/派生源 | 不得混同 | 失败/关联flow |
|---|---|---|---|---|
| 两Submit | Draft/Attempt/FrozenPayload/PreparedCommand/Feedback | 03完整input+SDKnoeffect prepare/association | draftRevision≠root版≠SDKkey；receipt≠result | 同名协议TC-PROTO001～004 |
| 20Queries | route/surface/page/material/local/host/AT | 03同名Request→port→qualifiedmapper→namedfactory | opaqueowner版≠local版；empty≠missing | 对应TC-PROTO009～048 |
| 7Consumers | change/result/resume/visibility/lifecycle/cleanup | 正式qualification或trustedhost/currentroot | LocalConsumerReceipt≠transportACK≠业务confirm | TC-PROTO049～062 |
| diagnostic2+Emit | 六字段/HandoffView | 显式用户/currentcontext/mode/qualifiedsink | accepted≠evidence，localid≠businesskey | TC-PROTO063～066/081/082 |
| local maintenance/navigation/search | recovery/projection/selection/querycontext | source currentread/repo版/parent与querylineage | job≠ownerRun；选择≠bindingtruth | TC-PROTO067～086 |
| reports | 05test-privateDTO，不构造ChatDomain | 实际run/manifest/results/safeversionrefs | EV预约≠真实结果，unit≠real | TC-REPORT001～007 |

#### 15.2.4 状态闭环表

所有正式enum取当前03 §9/Step6，合法/非法及产生函数见§6.3完整矩阵；下表逐主体回链，不增状态。

| 主体/enum | 正式状态/函数来源 | 合法/非法测试 | planned EV |
|---|---|---|---|
| RouteContext / RoutePhase | 03 §9.4.1完整状态与触发函数；05 §6.3.1 | TC-STATE-001 / 002 / 003（全合法/逐guard/全非法） | EV-UNIT-003 |
| AccessPosture / AccessAvailability | 03 §9.4.2完整状态与触发函数；05 §6.3.2 | TC-STATE-004 / 005 / 006（全合法/逐guard/全非法） | EV-UNIT-003 |
| ClientConsumptionContext / ConsumptionContextPosture | 03 §9.4.3完整状态与触发函数；05 §6.3.3 | TC-STATE-007 / 008 / 009（全合法/逐guard/全非法） | EV-UNIT-003 |
| SelectionState / SelectionPhase | 03 §9.5.1完整状态与触发函数；05 §6.3.4 | TC-STATE-010 / 011 / 012（全合法/逐guard/全非法） | EV-UI-002 |
| ProjectNavigationState / SelectionPhase | 03 §9.5.2完整状态与触发函数；05 §6.3.5 | TC-STATE-013 / 014 / 015（全合法/逐guard/全非法） | EV-UI-002 |
| ProjectDetailViewModel / PageLoadPosture | 03 §9.5.3完整状态与触发函数；05 §6.3.6 | TC-STATE-016 / 017 / 018（全合法/逐guard/全非法） | EV-UI-002 |
| ProcessFlowViewModel / PageLoadPosture | 03 §9.5.4完整状态与触发函数；05 §6.3.7 | TC-STATE-019 / 020 / 021（全合法/逐guard/全非法） | EV-UI-002 |
| ProcessNodeDetailViewModel / PageLoadPosture | 03 §9.5.5完整状态与触发函数；05 §6.3.8 | TC-STATE-022 / 023 / 024（全合法/逐guard/全非法） | EV-UI-002 |
| ProjectConversationLinkViewModel / PageLoadPosture | 03 §9.5.6完整状态与触发函数；05 §6.3.9 | TC-STATE-025 / 026 / 027（全合法/逐guard/全非法） | EV-UI-003 |
| CompanyDirectoryViewModel / PageLoadPosture | 03 §9.5.7完整状态与触发函数；05 §6.3.10 | TC-STATE-028 / 029 / 030（全合法/逐guard/全非法） | EV-UI-003 |
| DraftState / DraftPhase | 03 §9.6.1完整状态与触发函数；05 §6.3.11 | TC-STATE-031 / 032 / 033（全合法/逐guard/全非法） | EV-UNIT-001 |
| CommandAttemptState / CommandResultPosture | 03 §9.6.2完整状态与触发函数；05 §6.3.12 | TC-STATE-034 / 035 / 036（全合法/逐guard/全非法） | EV-UNIT-001 |
| FreshnessMarker / FreshnessState | 03 §9.7.1完整状态与触发函数；05 §6.3.13 | TC-STATE-037 / 038 / 039（全合法/逐guard/全非法） | EV-UNIT-002 |
| SafeMaterialSnapshot / DisclosurePosture | 03 §9.7.2完整状态与触发函数；05 §6.3.14 | TC-STATE-040 / 041 / 042（全合法/逐guard/全非法） | EV-UNIT-004 |
| ContinuityState / ContinuityPhase | 03 §9.7.3完整状态与触发函数；05 §6.3.15 | TC-STATE-043 / 044 / 045（全合法/逐guard/全非法） | EV-UNIT-002 |
| LocalProjectionEntry / LocalProjectionState | 03 §9.7.4完整状态与触发函数；05 §6.3.16 | TC-STATE-046 / 047 / 048（全合法/逐guard/全非法） | EV-UNIT-004 |
| PlatformCapabilityState / CapabilityAvailability | 03 §9.8.1完整状态与触发函数；05 §6.3.17 | TC-STATE-049 / 050 / 051（全合法/逐guard/全非法） | EV-NATIVE-001 |

#### 15.2.5 Query response/view闭环表

| Query | response/value定义 | 来源/空与降级/身份规则 | planned TC |
|---|---|---|---|
| ResolveEntryAccess | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-009/010 |
| LoadConversationSurface | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-011/012 |
| LoadTurnPage | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-013/014 |
| LoadOwnerSummary | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-015/016 |
| LoadArtifactPreview | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-017/018 |
| LoadIntentCapability | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-019/020 |
| ProbeCommandAttempt | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-021/022 |
| LoadResumeContext | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-023/024 |
| LoadLocalProjection | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-025/026 |
| LoadDraft | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-027/028 |
| ProbePlatformCapability | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-029/030 |
| LoadAccessibilityContext | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-031/032 |
| LoadProjectList | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-033/034 |
| LoadProjectDetail | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-035/036 |
| LoadProjectProcessFlow | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-037/038 |
| LoadStageProcessFlow | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-039/040 |
| LoadProcessNodeDetail | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-041/042 |
| LoadProjectConversationLinks | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-043/044 |
| LoadCompanyDirectory | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-045/046 |
| LoadMemberContext | 03 §7同名Reply.value→§5独立carrier/factory，全字段原定义 | 正式source/current资格；local/AT/host各自context；empty仅可披露正式结果，unavailable不猜不存在；refs不反解 | TC-PROTO-047/048 |

#### 15.2.6 Phase/commit boundary闭环

| 范围/成熟度 | 含义/前置 | 本阶段输出 | 排除后续事实 | 测试/验收 |
|---|---|---|---|---|
| 当前05设计停审 | 00～04前置，15Step串行校准 | plannedTC/fixture/suite/schema/EV | 不创建implementationledger/源代码/boundary或commit | 只文档审查 |
| future script_capability | 07真实boundary授权/测试脚本实现 | 参数/path/schema/redaction真实selftest | 不生成fullEV或acceptance | report suite |
| future index_shell | 真实run machineartifact | 最小索引与scope/status，detailnull | 不冒充完整P0证据 | TC-REPORT004/007 |
| future full_ev | realcase与完整map/明细、脱敏/哈希有效 | 完整actualEV/index与失败不足 | 不替代06判定 | 各TC/EV实际scope |
| future acceptance_handoff | 06/07授权+fullEV+实际审阅 | 验收初稿/风险材料 | 无签字不ready | 06定义门禁 |

未定义commit编号/顺序，07完成才创建全部planned boundary skeleton，状态planned/blocked/waiting。

#### 15.2.7 Public protocol传递类型闭环

Chat协议是03客户端typed surface，SDK wire仍由SDK/owner正式合同；以下每行核对原Request/Reply/input/enum/refs不漂移，状态测试共享正式12enum，testartifact DTO不进入publicsurface。

| surface | 外层/传递类型正式位置 | 来源/缺失/重复/retry与边界 | TC / planned EV |
|---|---|---|---|
| SubmitConversationIntent | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-01；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-001/002 / EV-UNIT-001 |
| SubmitGovernanceIntent | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-02；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-003/004 / EV-UNIT-001 |
| RequestSafePreview | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-03；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-005/006 / EV-UI-001 |
| AcknowledgeLocalRecoveryAction | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-04；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-007/008 / EV-UNIT-002 |
| ResolveEntryAccess | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-05；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-009/010 / EV-UNIT-003 |
| LoadConversationSurface | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-06；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-011/012 / EV-UI-001 |
| LoadTurnPage | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-07；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-013/014 / EV-UI-001 |
| LoadOwnerSummary | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-08；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-015/016 / EV-UI-001 |
| LoadArtifactPreview | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-09；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-017/018 / EV-UI-001 |
| LoadIntentCapability | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-10；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-019/020 / EV-UNIT-001 |
| ProbeCommandAttempt | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-11；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-021/022 / EV-UNIT-001 |
| LoadResumeContext | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-12；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-023/024 / EV-UNIT-002 |
| LoadLocalProjection | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-13；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-025/026 / EV-UNIT-004 |
| LoadDraft | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-14；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-027/028 / EV-UNIT-004 |
| ProbePlatformCapability | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-15；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-029/030 / EV-NATIVE-001 |
| LoadAccessibilityContext | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-16；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-031/032 / EV-UI-001 |
| LoadProjectList | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-17；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-033/034 / EV-UI-002 |
| LoadProjectDetail | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-18；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-035/036 / EV-UI-002 |
| LoadProjectProcessFlow | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-19；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-037/038 / EV-UI-002 |
| LoadStageProcessFlow | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-20；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-039/040 / EV-UI-002 |
| LoadProcessNodeDetail | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-21；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-041/042 / EV-UI-002 |
| LoadProjectConversationLinks | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-22；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-043/044 / EV-UI-003 |
| LoadCompanyDirectory | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-23；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-045/046 / EV-UI-003 |
| LoadMemberContext | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-24；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-047/048 / EV-UI-003 |
| ConsumeFormalChange | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-25；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-049/050 / EV-UNIT-002 |
| ConsumeCommandReceiptOrResult | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-26；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-051/052 / EV-UNIT-001 |
| ConsumeResumeResult | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-27；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-053/054 / EV-UNIT-002 |
| ConsumeVisibilityChange | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-28；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-055/056 / EV-UNIT-002 |
| ConsumeMaterialRevisionChange | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-29；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-057/058 / EV-UNIT-002 |
| ConsumeShellLifecycle | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-30；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-059/060 / EV-UNIT-002 |
| ConsumeEvictionTrigger | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-31；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-061/062 / EV-UNIT-004 |
| ClientDiagnosticHandoffRequested | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-32；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-063/064 / EV-UNIT-005 |
| ClientSupportContextRequested | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-33；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-065/066 / EV-UNIT-005 |
| ResumeChangeContext | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-34；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-067/068 / EV-UNIT-002 |
| RequeryAfterGap | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-35；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-069/070 / EV-UNIT-002 |
| ResolveUnknownAttempt | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-36；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-071/072 / EV-UNIT-001 |
| RefreshStaleMaterial | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-37；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-073/074 / EV-UNIT-002 |
| RestoreAfterShellRestart | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-38；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-075/076 / EV-UNIT-002 |
| PersistLocalProjection | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-39；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-077/078 / EV-UNIT-004 |
| EvictLocalMaterial | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-40；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-079/080 / EV-UNIT-004 |
| EmitDiagnosticHandoff | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-41；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-081/082 / EV-UNIT-005 |
| NavigateProjectContext | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-42；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-083/084 / EV-UI-002 |
| UpdateDirectorySearch | 03 §7同名Request/Reply与§5 input/value/carrier原卡 | CUT-P-43；ClientRequest严格schema/currentsession；异步全原slot检查；重复/noeffect/unknown按原flow，不privatefallback | TC-PROTO-085/086 / EV-UI-003 |

#### 15.2.8 命名一致性表

| 正式名 | 历史/口语污染 | 处理 |
|---|---|---|
| RouteContext/DraftState/CommandAttemptState | 旧ChatThread/InputDraft/ChatReplyState | 仅历史诊断不进当前用例 |
| CommandResultPosture七态 | ACK=confirmed/optimistic作为新enum | 只正式result gate；optimistic只是派生展示 |
| PageLoadPosture/FreshnessState/DisclosurePosture | 用ready替fresh/用redacted替授权 | 五page与各source各自状态 |
| ProjectNavigationState五tab | 顶层progress/独立项目进度tab | progress只项目详情tab |
| Process fork/branch/join | GovernanceGate=join/WorkItem补流程 | Process正式拓扑、Governance单独 |
| CompanyDirectory/ProjectMembers/Participants | Identity即全公司/目录即DM权限 | 独立provider/coverage/access |
| 8域14字段/6profiles | env覆盖/默认prod数值 | startupstrictsource，example非预算 |
| artifacts/test/<run_id>与reports/runs/<run_id> | latest/其他项目subfolder | 同run固定安全路径 |
| planned TC/EV / actual artifact | 手填pass/截图即EV | machine结果+scope/成熟度严格 |

#### 15.2.9 冲突与修正表

| ID | 位置/问题 | 本轮处理 | 状态 |
|---|---|---|---|
| CHAT-TEST-001 | 历史05对象/UX结构污染 | full-restart原路径十五章，43protocol/17主体 | closed_design，不是testpassed |
| CHAT-TEST-002 | sharedPageenum可能漏主体 | 17组三类case、保留source完整合法矩阵 | closed_design |
| CHAT-TEST-003 | host-unit只Rust不能测TSplatformstate | suite双入口+variant runner_kind，两引擎分母 | closed_design |
| CHAT-TEST-004 | reports需要redaction machine但只末次扫描 | 固定machine首次check→生成候选→finalcheck，无引用环 | closed_design |
| CHAT-TEST-005 | 参数覆盖/LocalPage.limit/retry值遗漏 | 逐字段负向、page.limit预算、15error.retry明确 | closed_design |
| CHAT-TEST-006 | calibration内本地文档相对链接 | 中间产物用../，正式用当前路径；17份05文件静态链接检查通过 | closed_design |
| CHAT-BASE-001 | 00未定义AC引用 | 当前实际AC/NFR索引，00修复需另行授权 | open |
| CHAT-UP/WS-UP/native/预算/来源 | 正向真实合同/环境无证据 | §14逐项blocked/owner激活 | open/blocked |

#### 15.2.10 正反例

正：current Process父图升级→旧stage/node slot失效→迟到child弃置；graph/list/ARIA同正式safe图；Gate仍独立Governance资格。
反：根据工具/提交/测试摘要全成功自行画join完成、给Gate approved或生成EV。
正：两提交callback争second CAS，只winner先写dispatched/submitted后单dispatch；reply丢失unknown只probe。
反：ACK/toast成功或not_found即noeffect，客户端自动再次dispatch。
正：真实suite blocked有安全report/缺instance；index不假造case，unitEV保持fixture scope。
反：把原型截图或fixturepassed填入formalSDKEV，人工编辑passed/acceptance。

### 15.3 设计收口与下一读取

05十五章、216TC族/16suite/16plannedEV、43协议/17主体/12配置cut、14并发/15错误、24NFR和真实层阻塞均完成设计映射。只静态文档检查，应用实现与测试运行not_started。
正式05完成即停审；下一步如用户授权06，先读验收SOP/书写规范、05§5/§6/§12～14与当前00§14、03§15/04§12，核对真实证据与支持矩阵成熟度。未经授权不进入06，不提交commit。


## 8. 回填草稿

正式05 §15回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

Step1～15均有10节；正式05原路径十五章已装配并停审。静态检查17份05文件的围栏/表格列/相对链接、十五章顺序、TC注册与EV完整分区、43protocol/17主体/12CFG和真实AC有效，git diff --check通过；216TC族/16suite/16planned EV。误报undefined检查已核实为TC-CFG-002/004的合法负向输入，并非缺值。本地设计gate pass_with_upstream_blockers；真实层和全部上游blocker未解除，未应用测试/运行/生成EV。不进入06，不提交commit。
