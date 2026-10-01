# L5-chat 07 · Step 7 测试与验收门禁嵌入

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step8已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step6已done、07flow/项目台账与对应来源；07 SOP Step7、书写规范5.7；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

每phase/boundary有当前TC/variant与AC/VETO及报告成熟度；216TC/16suiteEV/142P0/10VETO保持既有身份，真实scope和手工审阅独立。三CLI原样、machine→首检→候选→final；06writer用既有generator，E018与签署无cycle。

## 4. 当前文档问题诊断

早期TC首次责任可能被误读为全族完成；报告/验收参数会在10-a增加，旧EV不能继续冒充当前manifest。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 早期TC首次责任可能被误读为全族完成；报告/验收参数会在10-a增加，旧EV不能继续冒充当前manifest。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

primaryowner只定义首次切口；跨页面参数到后续补齐、09-a全分母，10-a验收参数新run；fullPR/EV严格缺行blocked，保护交付分支不绕门禁。

## 7. 结构化中间产物

### 7.1 证据、分母与实际门禁口径

保留05的216唯一TC、16suite/16EV与06的36实际父AC、142P0gate/10VETO。TC是测试族，必须逐protocol guard/error、状态合法/非法row、并发调度、config boundary、支持矩阵产生完整variant分母；本章primary boundary仅“首次安排其当前切口”的责任，不是全族完成承诺。跨后序页面/流程/原生的case实例在相应功能到位后补齐并重跑，最终完整分母冻结由commit-09-a核对。

特别是TC-AT-001/003/004/005、TC-SAFE-002/004/008/009以及change/revoke/resume/freshness全page参数，早期当前component检查不能证明后序项目/目录/发送/恢复/native。manifest允许保留未实现variant的missing/blocked；禁止删参数使suite/EV passed。TC-REAL-001 formal主线包含变化/resume，07-a先做read/command实例，07-b补齐全部formal实例；TC-REAL-004正式两端业务幂等在07-b。08-b actualnative/manualAT需要真实operator与批准环境。报告/验收私有DTO的既有TC-REPORT-001/002/004/006/007参数在10-a补齐，重新固定manifest/run/EV-REPORT-001，不补造新TC/EV。

targeted scope gate是当前boundary的实际检查，不写成05完整PR gate或EV passed。05规定完整PR的13个local suite、staging/release的真实层不能被07豁免；未齐则完整gate blocked。若已获局部commit授权可在独立review分支记录增量，受保护交付分支合并与送验仍须完整要求。当前无测试运行、commit、EV或验收。

### 7.2 TC / suite / EV责任映射

| TC族 | 数量 | 当前cut与首次boundary映射 | 全量完成门禁 |
|---|---|---|---|
| TC-PROTO-001～086 | 86 | 下表43协议逐对 | 对应03 §7/8所有input/guard/失败与幂等variant；09-a核完整 |
| TC-STATE-001～051 | 51 | 下表17主体逐三族 | 03 §9所有行/多值展开/guard negative/unlisted；09-a核完整 |
| TC-CFG-001～024 | 24 | 01-a；native011/012→08-a、Process019/020→06-b、diagnostic021/022→05-b | composition/SDK/切换/持有/rollback参数随相关boundary补齐；09-a核完整 |
| TC-CONC-001～014 | 14 | 见boundary表 | 双顺序/同turn/late/revoke/delete/unknown/恢复及有界性，当前增量与09-a完整 |
| TC-ERROR-001～015 | 15 | 各生产boundary先测命中错误；09-a全15分类 | dependency_unbound/unavailable/effect_unknown等不可串；有actualmapper |
| TC-SAFE-001～010 | 10 | 见boundary表 | AST仅解析fixture；allpage/preview/恢复等后序参数补齐；09-a完整 |
| TC-AT-001～005 | 5 | 03-a、03-b、06-b先各自UI切口 | 06-c/08-b补主线和真实AT；09-a完整本层分母 |
| TC-REPORT-001～007 | 7 | 01-b selftest→09-b full_ev→10-a acceptance参数 | 源schema/maturity/TC分母变化必须新run，不能重用09-b的旧EV-REPORT |
| TC-REAL-001～004 | 4 | 07-a/b SDK；08-b native/manual | formal_sdk/native_host/manual_at proof_scope不被fixture替代 |

| 协议与03位置 | 首次行为boundary | 已注册成对TC | suite / EV |
|---|---|---|---|
| SubmitConversationIntent / §7.3.1 | commit-04-a | TC-PROTO-001, TC-PROTO-002 | EV-UNIT-001 |
| SubmitGovernanceIntent / §7.3.2 | commit-04-b | TC-PROTO-003, TC-PROTO-004 | EV-UNIT-001 |
| RequestSafePreview / §7.3.3 | commit-04-a | TC-PROTO-005, TC-PROTO-006 | EV-UI-001 |
| AcknowledgeLocalRecoveryAction / §7.3.4 | commit-05-b | TC-PROTO-007, TC-PROTO-008 | EV-UNIT-002 |
| ResolveEntryAccess / §7.4.1 | commit-02-a | TC-PROTO-009, TC-PROTO-010 | EV-UNIT-003 |
| LoadConversationSurface / §7.4.2 | commit-03-a | TC-PROTO-011, TC-PROTO-012 | EV-UI-001 |
| LoadTurnPage / §7.4.3 | commit-03-a | TC-PROTO-013, TC-PROTO-014 | EV-UI-001 |
| LoadOwnerSummary / §7.4.4 | commit-03-b | TC-PROTO-015, TC-PROTO-016 | EV-UI-001 |
| LoadArtifactPreview / §7.4.5 | commit-03-b | TC-PROTO-017, TC-PROTO-018 | EV-UI-001 |
| LoadIntentCapability / §7.4.6 | commit-04-a | TC-PROTO-019, TC-PROTO-020 | EV-UNIT-001 |
| ProbeCommandAttempt / §7.4.7 | commit-04-a | TC-PROTO-021, TC-PROTO-022 | EV-UNIT-001 |
| LoadResumeContext / §7.4.8 | commit-05-a | TC-PROTO-023, TC-PROTO-024 | EV-UNIT-002 |
| LoadLocalProjection / §7.5.1 | commit-02-b | TC-PROTO-025, TC-PROTO-026 | EV-UNIT-004 |
| LoadDraft / §7.5.2 | commit-04-a | TC-PROTO-027, TC-PROTO-028 | EV-UNIT-004 |
| ProbePlatformCapability / §7.5.3 | commit-08-a | TC-PROTO-029, TC-PROTO-030 | EV-NATIVE-001 |
| LoadAccessibilityContext / §7.5.4 | commit-03-a | TC-PROTO-031, TC-PROTO-032 | EV-UI-001 |
| LoadProjectList / §7.6.1 | commit-06-a | TC-PROTO-033, TC-PROTO-034 | EV-UI-002 |
| LoadProjectDetail / §7.6.2 | commit-06-a | TC-PROTO-035, TC-PROTO-036 | EV-UI-002 |
| LoadProjectProcessFlow / §7.6.3 | commit-06-b | TC-PROTO-037, TC-PROTO-038 | EV-UI-002 |
| LoadStageProcessFlow / §7.6.4 | commit-06-b | TC-PROTO-039, TC-PROTO-040 | EV-UI-002 |
| LoadProcessNodeDetail / §7.6.5 | commit-06-b | TC-PROTO-041, TC-PROTO-042 | EV-UI-002 |
| LoadProjectConversationLinks / §7.6.6 | commit-06-c | TC-PROTO-043, TC-PROTO-044 | EV-UI-003 |
| LoadCompanyDirectory / §7.6.7 | commit-06-c | TC-PROTO-045, TC-PROTO-046 | EV-UI-003 |
| LoadMemberContext / §7.6.8 | commit-06-c | TC-PROTO-047, TC-PROTO-048 | EV-UI-003 |
| ConsumeFormalChange / §7.7.1 | commit-05-a | TC-PROTO-049, TC-PROTO-050 | EV-UNIT-002 |
| ConsumeCommandReceiptOrResult / §7.7.2 | commit-04-a | TC-PROTO-051, TC-PROTO-052 | EV-UNIT-001 |
| ConsumeResumeResult / §7.7.3 | commit-05-a | TC-PROTO-053, TC-PROTO-054 | EV-UNIT-002 |
| ConsumeVisibilityChange / §7.7.4 | commit-05-a | TC-PROTO-055, TC-PROTO-056 | EV-UNIT-002 |
| ConsumeMaterialRevisionChange / §7.7.5 | commit-05-a | TC-PROTO-057, TC-PROTO-058 | EV-UNIT-002 |
| ConsumeShellLifecycle / §7.7.6 | commit-05-b | TC-PROTO-059, TC-PROTO-060 | EV-UNIT-002 |
| ConsumeEvictionTrigger / §7.7.7 | commit-02-b | TC-PROTO-061, TC-PROTO-062 | EV-UNIT-004 |
| ClientDiagnosticHandoffRequested / §7.8.1 | commit-05-b | TC-PROTO-063, TC-PROTO-064 | EV-UNIT-005 |
| ClientSupportContextRequested / §7.8.2 | commit-05-b | TC-PROTO-065, TC-PROTO-066 | EV-UNIT-005 |
| ResumeChangeContext / §7.9.1 | commit-05-a | TC-PROTO-067, TC-PROTO-068 | EV-UNIT-002 |
| RequeryAfterGap / §7.9.2 | commit-05-a | TC-PROTO-069, TC-PROTO-070 | EV-UNIT-002 |
| ResolveUnknownAttempt / §7.9.3 | commit-04-a | TC-PROTO-071, TC-PROTO-072 | EV-UNIT-001 |
| RefreshStaleMaterial / §7.9.4 | commit-05-b | TC-PROTO-073, TC-PROTO-074 | EV-UNIT-002 |
| RestoreAfterShellRestart / §7.9.5 | commit-05-b | TC-PROTO-075, TC-PROTO-076 | EV-UNIT-002 |
| PersistLocalProjection / §7.9.6 | commit-02-b | TC-PROTO-077, TC-PROTO-078 | EV-UNIT-004 |
| EvictLocalMaterial / §7.9.7 | commit-02-b | TC-PROTO-079, TC-PROTO-080 | EV-UNIT-004 |
| EmitDiagnosticHandoff / §7.9.8 | commit-05-b | TC-PROTO-081, TC-PROTO-082 | EV-UNIT-005 |
| NavigateProjectContext / §7.10.1 | commit-06-a | TC-PROTO-083, TC-PROTO-084 | EV-UI-002 |
| UpdateDirectorySearch / §7.10.2 | commit-06-c | TC-PROTO-085, TC-PROTO-086 | EV-UI-003 |

| 状态主体与03位置 | 首次完整pure矩阵责任boundary | 三个TC族 | suite / EV |
|---|---|---|---|
| RouteContext / §9.4.1 | commit-02-a（后序trigger仍待对应flow完整验证） | TC-STATE-001, TC-STATE-002, TC-STATE-003 | EV-UNIT-003 |
| AccessPosture / §9.4.2 | commit-02-a（后序trigger仍待对应flow完整验证） | TC-STATE-004, TC-STATE-005, TC-STATE-006 | EV-UNIT-003 |
| ClientConsumptionContext / §9.4.3 | commit-02-a（后序trigger仍待对应flow完整验证） | TC-STATE-007, TC-STATE-008, TC-STATE-009 | EV-UNIT-003 |
| SelectionState / §9.5.1 | commit-03-a（后序trigger仍待对应flow完整验证） | TC-STATE-010, TC-STATE-011, TC-STATE-012 | EV-UI-002 |
| ProjectNavigationState / §9.5.2 | commit-06-a（后序trigger仍待对应flow完整验证） | TC-STATE-013, TC-STATE-014, TC-STATE-015 | EV-UI-002 |
| ProjectDetailViewModel / §9.5.3 | commit-06-a（后序trigger仍待对应flow完整验证） | TC-STATE-016, TC-STATE-017, TC-STATE-018 | EV-UI-002 |
| ProcessFlowViewModel / §9.5.4 | commit-06-b（后序trigger仍待对应flow完整验证） | TC-STATE-019, TC-STATE-020, TC-STATE-021 | EV-UI-002 |
| ProcessNodeDetailViewModel / §9.5.5 | commit-06-b（后序trigger仍待对应flow完整验证） | TC-STATE-022, TC-STATE-023, TC-STATE-024 | EV-UI-002 |
| ProjectConversationLinkViewModel / §9.5.6 | commit-06-c（后序trigger仍待对应flow完整验证） | TC-STATE-025, TC-STATE-026, TC-STATE-027 | EV-UI-003 |
| CompanyDirectoryViewModel / §9.5.7 | commit-06-c（后序trigger仍待对应flow完整验证） | TC-STATE-028, TC-STATE-029, TC-STATE-030 | EV-UI-003 |
| DraftState / §9.6.1 | commit-04-a（后序trigger仍待对应flow完整验证） | TC-STATE-031, TC-STATE-032, TC-STATE-033 | EV-UNIT-001 |
| CommandAttemptState / §9.6.2 | commit-04-a（后序trigger仍待对应flow完整验证） | TC-STATE-034, TC-STATE-035, TC-STATE-036 | EV-UNIT-001 |
| FreshnessMarker / §9.7.1 | commit-02-b（后序trigger仍待对应flow完整验证） | TC-STATE-037, TC-STATE-038, TC-STATE-039 | EV-UNIT-002 |
| SafeMaterialSnapshot / §9.7.2 | commit-02-b（后序trigger仍待对应flow完整验证） | TC-STATE-040, TC-STATE-041, TC-STATE-042 | EV-UNIT-004 |
| ContinuityState / §9.7.3 | commit-05-a（后序trigger仍待对应flow完整验证） | TC-STATE-043, TC-STATE-044, TC-STATE-045 | EV-UNIT-002 |
| LocalProjectionEntry / §9.7.4 | commit-02-b（后序trigger仍待对应flow完整验证） | TC-STATE-046, TC-STATE-047, TC-STATE-048 | EV-UNIT-004 |
| PlatformCapabilityState / §9.8.1 | commit-08-a（后序trigger仍待对应flow完整验证） | TC-STATE-049, TC-STATE-050, TC-STATE-051 | EV-NATIVE-001 |

| suite | 源入口 | proof_scope | 预约EV | 主要boundary/补齐点 |
|---|---|---|---|---|
| intent | tests/intent_result_tests.ts | isolated_fixture | EV-UNIT-001 | commit-04-a, commit-04-b；全分母09-a，证据09-b；report acceptance参数10-a |
| presentation | tests/presentation_accessibility_tests.tsx | isolated_fixture | EV-UI-001 | commit-04-a, commit-03-a, commit-03-b, commit-06-b；全分母09-a，证据09-b；report acceptance参数10-a |
| continuity | tests/continuity_recovery_tests.ts | isolated_fixture | EV-UNIT-002 | commit-05-b, commit-05-a, commit-02-b；全分母09-a，证据09-b；report acceptance参数10-a |
| navigation | tests/navigation_boundary_tests.ts | isolated_fixture | EV-UNIT-003 | commit-02-a；全分母09-a，证据09-b；report acceptance参数10-a |
| persistence | tests/persistence_boundary_tests.ts | isolated_fixture | EV-UNIT-004 | commit-02-b, commit-04-a；全分母09-a，证据09-b；report acceptance参数10-a |
| host-unit | tests/sdk_binding_tests.ts（TS platform adapter/factory）；src-tauri/tests/platform_boundary_tests.rs（Rust HostBoundaryGuard） | isolated_fixture | EV-NATIVE-001 | commit-08-a；全分母09-a，证据09-b；report acceptance参数10-a |
| process | tests/project_process_boundary_tests.tsx | isolated_fixture | EV-UI-002 | commit-06-a, commit-06-b, commit-03-a；全分母09-a，证据09-b；report acceptance参数10-a |
| directory | tests/directory_relationship_boundary_tests.tsx | isolated_fixture | EV-UI-003 | commit-06-c；全分母09-a，证据09-b；report acceptance参数10-a |
| diagnostic | tests/sdk_binding_tests.ts | isolated_fixture | EV-UNIT-005 | commit-05-b；全分母09-a，证据09-b；report acceptance参数10-a |
| config | tests/sdk_binding_tests.ts | isolated_fixture | EV-UNIT-006 | commit-01-a；全分母09-a，证据09-b；report acceptance参数10-a |
| errors | tests/sdk_binding_tests.ts | isolated_fixture | EV-UNIT-007 | commit-09-a；全分母09-a，证据09-b；report acceptance参数10-a |
| boundary | tests/sdk_binding_tests.ts | isolated_fixture | EV-UNIT-008 | commit-01-a；全分母09-a，证据09-b；report acceptance参数10-a |
| report | tests/sdk_binding_tests.ts | isolated_fixture | EV-REPORT-001 | commit-09-b；全分母09-a，证据09-b；report acceptance参数10-a |
| sdk-real | tests/sdk_binding_tests.ts | formal_sdk | EV-SDK-001 | commit-07-a, commit-07-b；全分母09-a，证据09-b；report acceptance参数10-a |
| desktop-real | src-tauri/tests/platform_boundary_tests.rs | native_host | EV-HOST-001 | commit-08-b；全分母09-a，证据09-b；report acceptance参数10-a |
| at-real | tests/presentation_accessibility_tests.tsx | manual_at | EV-AT-001 | commit-08-b；全分母09-a，证据09-b；report acceptance参数10-a |

host-unit是复合suite：TS负责TC-PROTO-029/030、TC-STATE-049～051，Rust负责TC-CFG-011/012与TC-SAFE-007的native guard参数，TS仍负责它们的business-boundary参数；每variant唯一runner_kind/source，两引擎expected全集合并才可suitepassed。其它suite也不得因共用sdk_binding_tests.ts全文件执行就冒报每suite分母。

### 7.3 阶段与boundary测试门禁

| phase | 测试门禁 | 验收关联 | 脚本/成熟度 | artifact/report输出 | 失败处理 |
|---|---|---|---|---|---|
| PH-01 | config, boundary；当前TC/variant及受影响回归 | config/boundary/report的当前TC与schema负例；对应06配置/证据红线；无fullPR/EV pass；本章逐gate责任 | script_capability → index_shell；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-02 | navigation, continuity, persistence；当前TC/variant及受影响回归 | navigation/persistence/freshness当前矩阵与CAS/revoke/delete失败；06访问/持有红线；本章逐gate责任 | index_shell；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-03 | presentation, process；当前TC/variant及受影响回归 | presentation/AT当前instance、unsafe preview与不可见目标；06功能/来源/可访问性门禁；本章逐gate责任 | index_shell；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-04 | intent, presentation, persistence；当前TC/variant及受影响回归 | intent全合法/非法状态和竞态；06协议/状态/ACK一票否决；真实层仍blocked；本章逐gate责任 | index_shell；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-05 | continuity, diagnostic；当前TC/variant及受影响回归 | continuity/diagnostic全参数与late/revoke竞态；06一致性/恢复/脱敏红线；本章逐gate责任 | index_shell；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-06 | process, presentation, directory；当前TC/variant及受影响回归 | process/directory及AT/parent-version/gap全参数；06项目流程/关系/目录门禁；本章逐gate责任 | index_shell；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-07 | sdk-real；当前TC/variant及受影响回归 | TC-REAL-001/004正式环境及当前local回归；06跨仓/证据门禁；未闭合operation blocked；本章逐gate责任 | index_shell；仅已测formal层；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-08 | host-unit, desktop-real, at-real；当前TC/variant及受影响回归 | nativeguard正反例、TC-REAL-002/003批准OS/AT；06 native/可访问性与VETO；本章逐gate责任 | index_shell；仅已测native/manual层；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-09 | errors, report；当前TC/variant及受影响回归 | 完整05 PR/nightly/staging/release各自scope gate；06全部142P0/10VETO的实际证据资格；本章逐gate责任 | full_ev；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |
| PH-10 | 既有report selftest/实际审阅；当前TC/variant及受影响回归 | 06 chat.acceptance.v1/schema/digest/E018/六签署及§4/11～14真实裁决；07完成谓词；本章逐gate责任 | acceptance_handoff；§7.5三个CLI，targeted结果不当全PR | 实际run才artifacts/test/<run_id>和reports/runs/<run_id>；PH10批准后acceptance初稿 | 当前scope失败停本phase；修ownerboundary或wait_design，复验新run |

| boundary | 首次TC责任（全部planned） | suite / EV关联（不是passed） | AC / VETO关联 | artifact/report与成熟度 | 失败处理 |
|---|---|---|---|---|---|
| commit-01-a | TC-CFG-001, TC-CFG-002, TC-CFG-003, TC-CFG-004, TC-CFG-005, TC-CFG-006, TC-CFG-007, TC-CFG-008, TC-CFG-009, TC-CFG-010, TC-CFG-013, TC-CFG-014, TC-CFG-015, TC-CFG-016, TC-CFG-017, TC-CFG-018, TC-CFG-023, TC-CFG-024, TC-SAFE-001 | config, boundary / EV-UNIT-006, EV-UNIT-008 | AC-BR-CHAT-001, AC-DR-CHAT-005, AC-NFR-CHAT-003, AC-NFR-CHAT-004；VETO-CHAT-001, VETO-CHAT-009, VETO-CHAT-010 | script_capability；当前bootstrap/config/source实际targeted检查；无正式run/EV；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-01-b | 已注册report/schema selftest或只读actual审阅；不新增TC | report / EV-REPORT-001审阅输入 | ；全项目VETO持续 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-02-a | TC-PROTO-009, TC-PROTO-010, TC-SAFE-002, TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004, TC-STATE-005, TC-STATE-006, TC-STATE-007, TC-STATE-008, TC-STATE-009 | navigation / EV-UNIT-003 | AC-FR-CHAT-001, AC-CHAT-001, AC-BR-CHAT-001, AC-CHAT-005, AC-NFR-CHAT-002, AC-NFR-CHAT-003, AC-NFR-CHAT-004；VETO-CHAT-002, VETO-CHAT-009 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-02-b | TC-CONC-010, TC-PROTO-025, TC-PROTO-026, TC-PROTO-061, TC-PROTO-062, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-SAFE-004, TC-STATE-037, TC-STATE-038, TC-STATE-039, TC-STATE-040, TC-STATE-041, TC-STATE-042, TC-STATE-046, TC-STATE-047, TC-STATE-048 | continuity, persistence / EV-UNIT-002, EV-UNIT-004 | AC-FR-CHAT-008, AC-CHAT-004, AC-DR-CHAT-001, AC-DR-CHAT-004, AC-CHAT-002, AC-CHAT-005, AC-NFR-CHAT-005, AC-NFR-CHAT-003, AC-NFR-CHAT-004；VETO-CHAT-004, VETO-CHAT-006 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-03-a | TC-AT-001, TC-AT-003, TC-AT-004, TC-PROTO-011, TC-PROTO-012, TC-PROTO-013, TC-PROTO-014, TC-PROTO-031, TC-PROTO-032, TC-SAFE-008, TC-SAFE-009, TC-STATE-010, TC-STATE-011, TC-STATE-012 | presentation, process / EV-UI-001, EV-UI-002 | AC-FR-CHAT-001, AC-FR-CHAT-002, AC-FR-CHAT-010, AC-CHAT-002, AC-CHAT-005, AC-BR-CHAT-002, AC-BR-CHAT-005, AC-DR-CHAT-003, AC-NFR-CHAT-001, AC-NFR-CHAT-007, AC-NFR-CHAT-004；VETO-CHAT-007 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-03-b | TC-AT-005, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018 | presentation / EV-UI-001 | AC-FR-CHAT-002, AC-FR-CHAT-003, AC-FR-CHAT-004, AC-CHAT-002, AC-BR-CHAT-002, AC-DR-CHAT-002, AC-DR-CHAT-003, AC-NFR-CHAT-002, AC-NFR-CHAT-007, AC-NFR-CHAT-004；VETO-CHAT-007 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-04-a | TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-PROTO-001, TC-PROTO-002, TC-PROTO-005, TC-PROTO-006, TC-PROTO-019, TC-PROTO-020, TC-PROTO-021, TC-PROTO-022, TC-PROTO-027, TC-PROTO-028, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-SAFE-003, TC-STATE-031, TC-STATE-032, TC-STATE-033, TC-STATE-034, TC-STATE-035, TC-STATE-036 | intent, presentation, persistence / EV-UNIT-001, EV-UI-001, EV-UNIT-004 | AC-FR-CHAT-001, AC-FR-CHAT-003, AC-FR-CHAT-005, AC-FR-CHAT-006, AC-CHAT-001, AC-CHAT-003, AC-CHAT-004, AC-BR-CHAT-001, AC-BR-CHAT-003, AC-DR-CHAT-001, AC-DR-CHAT-003, AC-CHAT-002, AC-CHAT-005, AC-NFR-CHAT-005, AC-NFR-CHAT-001, AC-NFR-CHAT-004；VETO-CHAT-002, VETO-CHAT-003, VETO-CHAT-009 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-04-b | TC-PROTO-003, TC-PROTO-004 | intent / EV-UNIT-001 | AC-FR-CHAT-003, AC-FR-CHAT-005, AC-CHAT-003, AC-BR-CHAT-003, AC-NFR-CHAT-004；VETO-CHAT-003 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-05-a | TC-CONC-006, TC-CONC-009, TC-CONC-011, TC-CONC-012, TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-SAFE-010, TC-STATE-043, TC-STATE-044, TC-STATE-045 | continuity / EV-UNIT-002 | AC-FR-CHAT-001, AC-FR-CHAT-004, AC-FR-CHAT-007, AC-FR-CHAT-008, AC-CHAT-001, AC-CHAT-004, AC-CHAT-005, AC-BR-CHAT-001, AC-BR-CHAT-002, AC-BR-CHAT-004, AC-DR-CHAT-002, AC-NFR-CHAT-005, AC-NFR-CHAT-001, AC-NFR-CHAT-002, AC-NFR-CHAT-004；VETO-CHAT-002, VETO-CHAT-006 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-05-b | TC-CFG-021, TC-CFG-022, TC-CONC-013, TC-CONC-014, TC-PROTO-007, TC-PROTO-008, TC-PROTO-059, TC-PROTO-060, TC-PROTO-063, TC-PROTO-064, TC-PROTO-065, TC-PROTO-066, TC-PROTO-073, TC-PROTO-074, TC-PROTO-075, TC-PROTO-076, TC-PROTO-081, TC-PROTO-082 | continuity, diagnostic / EV-UNIT-002, EV-UNIT-005 | AC-FR-CHAT-001, AC-FR-CHAT-008, AC-FR-CHAT-009, AC-CHAT-001, AC-CHAT-004, AC-BR-CHAT-004, AC-BR-CHAT-005, AC-DR-CHAT-004, AC-NFR-CHAT-003, AC-NFR-CHAT-005, AC-NFR-CHAT-001, AC-NFR-CHAT-002, AC-NFR-CHAT-006, AC-NFR-CHAT-004；VETO-CHAT-004, VETO-CHAT-006 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-06-a | TC-PROTO-033, TC-PROTO-034, TC-PROTO-035, TC-PROTO-036, TC-PROTO-083, TC-PROTO-084, TC-STATE-013, TC-STATE-014, TC-STATE-015, TC-STATE-016, TC-STATE-017, TC-STATE-018 | process / EV-UI-002 | AC-FR-CHAT-011, AC-CHAT-002, AC-CHAT-005, AC-NFR-CHAT-004；全项目VETO持续 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-06-b | TC-AT-002, TC-CFG-019, TC-CFG-020, TC-CONC-007, TC-CONC-008, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-SAFE-005, TC-STATE-019, TC-STATE-020, TC-STATE-021, TC-STATE-022, TC-STATE-023, TC-STATE-024 | presentation, process / EV-UI-001, EV-UI-002 | AC-FR-CHAT-011, AC-FR-CHAT-013, AC-CHAT-002, AC-BR-CHAT-002, AC-DR-CHAT-005, AC-NFR-CHAT-003, AC-CHAT-005, AC-NFR-CHAT-005, AC-NFR-CHAT-004, AC-NFR-CHAT-007；VETO-CHAT-001, VETO-CHAT-005, VETO-CHAT-007 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-06-c | TC-PROTO-043, TC-PROTO-044, TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-PROTO-085, TC-PROTO-086, TC-SAFE-006, TC-STATE-025, TC-STATE-026, TC-STATE-027, TC-STATE-028, TC-STATE-029, TC-STATE-030 | directory / EV-UI-003 | AC-FR-CHAT-002, AC-FR-CHAT-010, AC-FR-CHAT-012, AC-FR-CHAT-014, AC-CHAT-002, AC-BR-CHAT-002, AC-BR-CHAT-005, AC-DR-CHAT-005, AC-CHAT-005, AC-NFR-CHAT-004；VETO-CHAT-001, VETO-CHAT-005 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-07-a | TC-REAL-001 | sdk-real / EV-SDK-001 | AC-FR-CHAT-001, AC-FR-CHAT-002, AC-FR-CHAT-003, AC-FR-CHAT-004, AC-FR-CHAT-005, AC-FR-CHAT-006, AC-FR-CHAT-007, AC-FR-CHAT-008, AC-FR-CHAT-011, AC-FR-CHAT-012, AC-FR-CHAT-013, AC-FR-CHAT-014, AC-CHAT-001, AC-CHAT-002, AC-CHAT-003, AC-CHAT-004, AC-CHAT-005, AC-BR-CHAT-001, AC-BR-CHAT-002, AC-BR-CHAT-003, AC-BR-CHAT-004, AC-DR-CHAT-002, AC-DR-CHAT-003, AC-DR-CHAT-005, AC-NFR-CHAT-005, AC-NFR-CHAT-002, AC-NFR-CHAT-004；VETO-CHAT-009 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-07-b | TC-REAL-004 | sdk-real / EV-SDK-001 | AC-FR-CHAT-001, AC-FR-CHAT-002, AC-FR-CHAT-003, AC-FR-CHAT-004, AC-FR-CHAT-005, AC-FR-CHAT-006, AC-FR-CHAT-007, AC-FR-CHAT-008, AC-FR-CHAT-011, AC-FR-CHAT-012, AC-FR-CHAT-013, AC-FR-CHAT-014, AC-CHAT-001, AC-CHAT-002, AC-CHAT-003, AC-CHAT-004, AC-CHAT-005, AC-BR-CHAT-001, AC-BR-CHAT-002, AC-BR-CHAT-003, AC-BR-CHAT-004, AC-DR-CHAT-002, AC-DR-CHAT-003, AC-DR-CHAT-005, AC-NFR-CHAT-005, AC-NFR-CHAT-002, AC-NFR-CHAT-004；VETO-CHAT-009 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-08-a | TC-CFG-011, TC-CFG-012, TC-PROTO-029, TC-PROTO-030, TC-SAFE-007, TC-STATE-049, TC-STATE-050, TC-STATE-051 | host-unit / EV-NATIVE-001 | AC-FR-CHAT-010, AC-BR-CHAT-005, AC-NFR-CHAT-003, AC-CHAT-002, AC-CHAT-005, AC-NFR-CHAT-007, AC-NFR-CHAT-004；VETO-CHAT-010 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-08-b | TC-REAL-002, TC-REAL-003 | desktop-real, at-real / EV-HOST-001, EV-AT-001 | AC-CHAT-005, AC-BR-CHAT-005, AC-NFR-CHAT-003, AC-CHAT-002, AC-CHAT-004, AC-NFR-CHAT-007, AC-NFR-CHAT-004；VETO-CHAT-007, VETO-CHAT-009 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-09-a | TC-ERROR-001, TC-ERROR-002, TC-ERROR-003, TC-ERROR-004, TC-ERROR-005, TC-ERROR-006, TC-ERROR-007, TC-ERROR-008, TC-ERROR-009, TC-ERROR-010, TC-ERROR-011, TC-ERROR-012, TC-ERROR-013, TC-ERROR-014, TC-ERROR-015 | errors / EV-UNIT-007 | AC-NFR-CHAT-003, AC-NFR-CHAT-004；全项目VETO持续 | index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-09-b | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 | report / EV-REPORT-001 | AC-DR-CHAT-004, AC-NFR-CHAT-004, AC-CHAT-005；VETO-CHAT-004, VETO-CHAT-008, VETO-CHAT-009 | full_ev；同run完整machine/16EVdetail/schema/digest/两次redaction与不足；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-10-a | 已注册report/schema selftest或只读actual审阅；不新增TC | report / EV-REPORT-001审阅输入 | AC-NFR-CHAT-004, AC-CHAT-005；VETO-CHAT-001, VETO-CHAT-002, VETO-CHAT-003, VETO-CHAT-004, VETO-CHAT-005, VETO-CHAT-006, VETO-CHAT-007, VETO-CHAT-008, VETO-CHAT-009, VETO-CHAT-010 | acceptance_handoff；06私有schema/E018/review/六签署；writer只生成待审初稿；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |
| commit-10-b | 已注册report/schema selftest或只读actual审阅；不新增TC | report / EV-REPORT-001审阅输入 | AC-NFR-CHAT-004, AC-CHAT-005；VETO-CHAT-001, VETO-CHAT-002, VETO-CHAT-003, VETO-CHAT-004, VETO-CHAT-005, VETO-CHAT-006, VETO-CHAT-007, VETO-CHAT-008, VETO-CHAT-009, VETO-CHAT-010 | acceptance_handoff；06私有schema/E018/review/六签署；writer只生成待审初稿；actualrun固定roots；early missing仍blocked | 不进入next，scope内修复/设计暂停；新run不覆盖失败 |

### 7.4 142 gate和10VETO逐项实施追溯

“涉及boundary”由该gate既有TC的primaryowner并集得到，完整裁决仍要求所有TC/variant/EV与real_scope，不能任一boundary局部pass便判parent通过。所有142P0gate到09-b获得完整测试证据资格，E018及最终review类到10-a/b完成实际审阅输入/角色；所有VETO贯穿当前代码检查，在最终送验时实际审阅逐项clear/detected/unassessed。当前下面是设计映射，没有任何实际裁决。

| gate / VETO | 正式主题 / parent AC | 既有TC | 既有EV | 涉及boundary |
|---|---|---|---|---|
| GATE-CHAT-F-001 | 入口/语境 / AC-FR-CHAT-001 | TC-PROTO-009, TC-PROTO-010, TC-PROTO-011, TC-PROTO-012, TC-PROTO-019, TC-PROTO-020, TC-PROTO-055, TC-PROTO-056, TC-PROTO-075, TC-PROTO-076, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-UI-001, EV-UNIT-002, EV-UNIT-003, EV-SDK-001 | commit-02-a, commit-03-a, commit-04-a, commit-05-a, commit-05-b, commit-07-a, commit-07-b |
| GATE-CHAT-F-002 | Turn/跨owner展示 / AC-FR-CHAT-002 | TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-031, TC-PROTO-032, TC-PROTO-047, TC-PROTO-048, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-UI-003, EV-SDK-001 | commit-03-a, commit-03-b, commit-06-c, commit-07-a, commit-07-b |
| GATE-CHAT-F-003 | Gate/Artifact卡片 / AC-FR-CHAT-003 | TC-PROTO-003, TC-PROTO-004, TC-PROTO-005, TC-PROTO-006, TC-PROTO-017, TC-PROTO-018, TC-PROTO-019, TC-PROTO-020, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-UI-001, EV-SDK-001 | commit-04-b, commit-04-a, commit-03-b, commit-07-a, commit-07-b |
| GATE-CHAT-F-004 | 来源/降级 / AC-FR-CHAT-004 | TC-PROTO-015, TC-PROTO-016, TC-PROTO-049, TC-PROTO-050, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-UNIT-002, EV-SDK-001 | commit-03-b, commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-F-005 | 草稿/发送/治理意图 / AC-FR-CHAT-005 | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-027, TC-PROTO-028, TC-PROTO-051, TC-PROTO-052, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-UNIT-004, EV-SDK-001 | commit-04-a, commit-04-b, commit-07-a, commit-07-b |
| GATE-CHAT-F-006 | formal结果/unknown / AC-FR-CHAT-006 | TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-a, commit-07-a, commit-07-b |
| GATE-CHAT-F-007 | 正式变化/缺口 / AC-FR-CHAT-007 | TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-F-008 | 断线/重启/内存缓存 / AC-FR-CHAT-008 | TC-PROTO-025, TC-PROTO-026, TC-PROTO-059, TC-PROTO-060, TC-PROTO-067, TC-PROTO-068, TC-PROTO-075, TC-PROTO-076, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-UNIT-004, EV-SDK-001 | commit-02-b, commit-05-b, commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-F-009 | 低敏支持 / AC-FR-CHAT-009 | TC-PROTO-063, TC-PROTO-064, TC-PROTO-065, TC-PROTO-066, TC-PROTO-081, TC-PROTO-082 | EV-UNIT-005 | commit-05-b |
| GATE-CHAT-F-010 | 外围activation / AC-FR-CHAT-010 | TC-SAFE-006, TC-SAFE-007, TC-SAFE-008 | EV-UI-001, EV-NATIVE-001, EV-UI-003 | commit-06-c, commit-08-a, commit-03-a |
| GATE-CHAT-F-011 | 项目五tab/流程下钻 / AC-FR-CHAT-011 | TC-PROTO-033, TC-PROTO-034, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-083, TC-PROTO-084, TC-CONC-007, TC-CONC-008, TC-REAL-001, TC-REAL-004 | EV-UI-002, EV-SDK-001 | commit-06-a, commit-06-b, commit-07-a, commit-07-b |
| GATE-CHAT-F-012 | 群聊↔项目 / AC-FR-CHAT-012 | TC-PROTO-043, TC-PROTO-044, TC-REAL-001, TC-REAL-004 | EV-UI-003, EV-SDK-001 | commit-06-c, commit-07-a, commit-07-b |
| GATE-CHAT-F-013 | BPMN并行与Gate分离 / AC-FR-CHAT-013 | TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-AT-002, TC-SAFE-005, TC-CFG-019, TC-CFG-020, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-UI-002, EV-SDK-001 | commit-06-b, commit-07-a, commit-07-b |
| GATE-CHAT-F-014 | 公司目录/三成员集合 / AC-FR-CHAT-014 | TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-PROTO-085, TC-PROTO-086, TC-REAL-001, TC-REAL-004 | EV-UI-003, EV-SDK-001 | commit-06-c, commit-07-a, commit-07-b |
| GATE-CHAT-CORE-001 | 语境进入保持 / AC-CHAT-001 | TC-PROTO-009, TC-PROTO-010, TC-PROTO-019, TC-PROTO-020, TC-PROTO-055, TC-PROTO-056, TC-PROTO-075, TC-PROTO-076, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-UNIT-002, EV-UNIT-003, EV-SDK-001 | commit-02-a, commit-04-a, commit-05-a, commit-05-b, commit-07-a, commit-07-b |
| GATE-CHAT-CORE-002 | 正式事实显化 / AC-CHAT-002 | TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-043, TC-PROTO-044, TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-UI-002, EV-UI-003, EV-SDK-001 | commit-03-a, commit-03-b, commit-06-a, commit-06-b, commit-06-c, commit-07-a, commit-07-b |
| GATE-CHAT-CORE-003 | 受控意图结果 / AC-CHAT-003 | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-a, commit-04-b, commit-07-a, commit-07-b |
| GATE-CHAT-CORE-004 | 变化与恢复 / AC-CHAT-004 | TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-059, TC-PROTO-060, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-071, TC-PROTO-072, TC-PROTO-075, TC-PROTO-076, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-UNIT-002, EV-UNIT-004, EV-SDK-001 | commit-05-a, commit-05-b, commit-04-a, commit-02-b, commit-07-a, commit-07-b |
| GATE-CHAT-CORE-005 | 整体闭环 / AC-CHAT-005 | TC-SAFE-009, TC-SAFE-010, TC-REAL-001, TC-REAL-002, TC-REAL-003, TC-REAL-004 | EV-UI-001, EV-UNIT-002, EV-SDK-001, EV-HOST-001, EV-AT-001 | commit-03-a, commit-05-a, commit-07-a, commit-08-b, commit-07-b |
| GATE-CHAT-R-001 | 入口与scope红线 / AC-BR-CHAT-001 | TC-PROTO-009, TC-PROTO-010, TC-PROTO-019, TC-PROTO-020, TC-PROTO-055, TC-PROTO-056, TC-SAFE-001, TC-SAFE-002, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-UNIT-002, EV-UNIT-003, EV-UNIT-008, EV-SDK-001 | commit-02-a, commit-04-a, commit-05-a, commit-01-a, commit-07-a, commit-07-b |
| GATE-CHAT-R-002 | owner-safe显化红线 / AC-BR-CHAT-002 | TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-047, TC-PROTO-048, TC-PROTO-057, TC-PROTO-058, TC-SAFE-005, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-UNIT-002, EV-UI-002, EV-UI-003, EV-SDK-001 | commit-03-a, commit-03-b, commit-06-c, commit-05-a, commit-06-b, commit-07-a, commit-07-b |
| GATE-CHAT-R-003 | 意图/审批结果红线 / AC-BR-CHAT-003 | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-SAFE-003, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-a, commit-04-b, commit-07-a, commit-07-b |
| GATE-CHAT-R-004 | 变化/cursor/cache红线 / AC-BR-CHAT-004 | TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-075, TC-PROTO-076, TC-PROTO-081, TC-PROTO-082, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-UNIT-005, EV-SDK-001 | commit-05-a, commit-05-b, commit-07-a, commit-07-b |
| GATE-CHAT-R-005 | 平台/外围边界 / AC-BR-CHAT-005 | TC-PROTO-029, TC-PROTO-030, TC-PROTO-059, TC-PROTO-060, TC-SAFE-006, TC-SAFE-007, TC-SAFE-008, TC-REAL-002 | EV-UI-001, EV-UNIT-002, EV-NATIVE-001, EV-UI-003, EV-HOST-001 | commit-08-a, commit-05-b, commit-06-c, commit-03-a, commit-08-b |
| GATE-CHAT-R-006 | Chat-local数据 / AC-DR-CHAT-001 | TC-CONC-001, TC-CONC-002, TC-PROTO-027, TC-PROTO-028, TC-PROTO-077, TC-PROTO-078 | EV-UNIT-001, EV-UNIT-004 | commit-04-a, commit-02-b |
| GATE-CHAT-R-007 | safe snapshot数据 / AC-DR-CHAT-002 | TC-PROTO-015, TC-PROTO-016, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-CONC-009, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-UNIT-002, EV-SDK-001 | commit-03-b, commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-R-008 | external ref数据 / AC-DR-CHAT-003 | TC-PROTO-005, TC-PROTO-006, TC-PROTO-017, TC-PROTO-018, TC-SAFE-008, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-SDK-001 | commit-04-a, commit-03-b, commit-03-a, commit-07-a, commit-07-b |
| GATE-CHAT-R-009 | forbiddenbody/secret红线 / AC-DR-CHAT-004 | TC-SAFE-004, TC-REPORT-003, TC-REPORT-005, TC-PROTO-064, TC-PROTO-066, TC-PROTO-082 | EV-UNIT-004, EV-UNIT-005, EV-REPORT-001 | commit-02-b, commit-09-b, commit-05-b |
| GATE-CHAT-R-010 | 无重复ownertruth / AC-DR-CHAT-005 | TC-SAFE-001, TC-SAFE-005, TC-PROTO-044, TC-PROTO-048, TC-REAL-001, TC-REAL-004 | EV-UI-002, EV-UI-003, EV-UNIT-008, EV-SDK-001 | commit-01-a, commit-06-b, commit-06-c, commit-07-a, commit-07-b |
| GATE-CHAT-CFG-001 | strict输入 / AC-NFR-CHAT-003 | TC-CFG-001, TC-CFG-002 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-CFG-002 | required/default / AC-NFR-CHAT-003 | TC-CFG-003, TC-CFG-004 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-CFG-003 | 八数字 / AC-NFR-CHAT-003 | TC-CFG-005, TC-CFG-006 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-CFG-004 | profile交叉 / AC-NFR-CHAT-003 | TC-CFG-007, TC-CFG-008 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-CFG-005 | SDK绑定 / AC-NFR-CHAT-003 | TC-CFG-009, TC-CFG-010 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-CFG-006 | native资格 / AC-NFR-CHAT-003 | TC-CFG-011, TC-CFG-012, TC-REAL-002 | EV-NATIVE-001, EV-HOST-001 | commit-08-a, commit-08-b |
| GATE-CHAT-CFG-007 | composition / AC-NFR-CHAT-003 | TC-CFG-013, TC-CFG-014 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-CFG-008 | 切换迟到 / AC-NFR-CHAT-003 | TC-CFG-015, TC-CFG-016 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-CFG-009 | 容量/CAS / AC-NFR-CHAT-003 | TC-CFG-017, TC-CFG-018 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-CFG-010 | 拓扑预算 / AC-NFR-CHAT-003 | TC-CFG-019, TC-CFG-020 | EV-UI-002 | commit-06-b |
| GATE-CHAT-CFG-011 | 诊断六字段 / AC-NFR-CHAT-003 | TC-CFG-021, TC-CFG-022 | EV-UNIT-005 | commit-05-b |
| GATE-CHAT-CFG-012 | rollback漂移 / AC-NFR-CHAT-003 | TC-CFG-023, TC-CFG-024 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-P-001 | SubmitConversationIntent / AC-CHAT-003 | TC-PROTO-001, TC-PROTO-002, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-002 | SubmitGovernanceIntent / AC-CHAT-003 | TC-PROTO-003, TC-PROTO-004, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-003 | RequestSafePreview / AC-CHAT-002 | TC-PROTO-005, TC-PROTO-006, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-SDK-001 | commit-04-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-004 | AcknowledgeLocalRecoveryAction / AC-CHAT-004 | TC-PROTO-007, TC-PROTO-008, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-005 | ResolveEntryAccess / AC-CHAT-001 | TC-PROTO-009, TC-PROTO-010, TC-REAL-001, TC-REAL-004 | EV-UNIT-003, EV-SDK-001 | commit-02-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-006 | LoadConversationSurface / AC-CHAT-002 | TC-PROTO-011, TC-PROTO-012, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-SDK-001 | commit-03-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-007 | LoadTurnPage / AC-CHAT-002 | TC-PROTO-013, TC-PROTO-014, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-SDK-001 | commit-03-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-008 | LoadOwnerSummary / AC-CHAT-002 | TC-PROTO-015, TC-PROTO-016, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-SDK-001 | commit-03-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-009 | LoadArtifactPreview / AC-CHAT-002 | TC-PROTO-017, TC-PROTO-018, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-SDK-001 | commit-03-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-010 | LoadIntentCapability / AC-CHAT-003 | TC-PROTO-019, TC-PROTO-020, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-011 | ProbeCommandAttempt / AC-CHAT-003 | TC-PROTO-021, TC-PROTO-022, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-012 | LoadResumeContext / AC-CHAT-004 | TC-PROTO-023, TC-PROTO-024, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-013 | LoadLocalProjection / AC-CHAT-002 | TC-PROTO-025, TC-PROTO-026 | EV-UNIT-004 | commit-02-b |
| GATE-CHAT-P-014 | LoadDraft / AC-CHAT-002 | TC-PROTO-027, TC-PROTO-028 | EV-UNIT-004 | commit-04-a |
| GATE-CHAT-P-015 | ProbePlatformCapability / AC-CHAT-002 | TC-PROTO-029, TC-PROTO-030, TC-REAL-002 | EV-NATIVE-001, EV-HOST-001 | commit-08-a, commit-08-b |
| GATE-CHAT-P-016 | LoadAccessibilityContext / AC-CHAT-002 | TC-PROTO-031, TC-PROTO-032, TC-REAL-003 | EV-UI-001, EV-AT-001 | commit-03-a, commit-08-b |
| GATE-CHAT-P-017 | LoadProjectList / AC-CHAT-002 | TC-PROTO-033, TC-PROTO-034, TC-REAL-001, TC-REAL-004 | EV-UI-002, EV-SDK-001 | commit-06-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-018 | LoadProjectDetail / AC-FR-CHAT-011 | TC-PROTO-035, TC-PROTO-036, TC-REAL-001, TC-REAL-004 | EV-UI-002, EV-SDK-001 | commit-06-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-019 | LoadProjectProcessFlow / AC-FR-CHAT-011 | TC-PROTO-037, TC-PROTO-038, TC-REAL-001, TC-REAL-004 | EV-UI-002, EV-SDK-001 | commit-06-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-020 | LoadStageProcessFlow / AC-FR-CHAT-011 | TC-PROTO-039, TC-PROTO-040, TC-REAL-001, TC-REAL-004 | EV-UI-002, EV-SDK-001 | commit-06-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-021 | LoadProcessNodeDetail / AC-FR-CHAT-011 | TC-PROTO-041, TC-PROTO-042, TC-REAL-001, TC-REAL-004 | EV-UI-002, EV-SDK-001 | commit-06-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-022 | LoadProjectConversationLinks / AC-FR-CHAT-012 | TC-PROTO-043, TC-PROTO-044, TC-REAL-001, TC-REAL-004 | EV-UI-003, EV-SDK-001 | commit-06-c, commit-07-a, commit-07-b |
| GATE-CHAT-P-023 | LoadCompanyDirectory / AC-FR-CHAT-014 | TC-PROTO-045, TC-PROTO-046, TC-REAL-001, TC-REAL-004 | EV-UI-003, EV-SDK-001 | commit-06-c, commit-07-a, commit-07-b |
| GATE-CHAT-P-024 | LoadMemberContext / AC-FR-CHAT-014 | TC-PROTO-047, TC-PROTO-048, TC-REAL-001, TC-REAL-004 | EV-UI-003, EV-SDK-001 | commit-06-c, commit-07-a, commit-07-b |
| GATE-CHAT-P-025 | ConsumeFormalChange / AC-CHAT-004 | TC-PROTO-049, TC-PROTO-050, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-026 | ConsumeCommandReceiptOrResult / AC-CHAT-003 | TC-PROTO-051, TC-PROTO-052, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-027 | ConsumeResumeResult / AC-CHAT-004 | TC-PROTO-053, TC-PROTO-054, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-028 | ConsumeVisibilityChange / AC-CHAT-004 | TC-PROTO-055, TC-PROTO-056, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-029 | ConsumeMaterialRevisionChange / AC-CHAT-004 | TC-PROTO-057, TC-PROTO-058, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-030 | ConsumeShellLifecycle / AC-CHAT-004 | TC-PROTO-059, TC-PROTO-060, TC-REAL-002 | EV-UNIT-002, EV-HOST-001 | commit-05-b, commit-08-b |
| GATE-CHAT-P-031 | ConsumeEvictionTrigger / AC-CHAT-004 | TC-PROTO-061, TC-PROTO-062 | EV-UNIT-004 | commit-02-b |
| GATE-CHAT-P-032 | ClientDiagnosticHandoffRequested / AC-FR-CHAT-009 | TC-PROTO-063, TC-PROTO-064 | EV-UNIT-005 | commit-05-b |
| GATE-CHAT-P-033 | ClientSupportContextRequested / AC-FR-CHAT-009 | TC-PROTO-065, TC-PROTO-066 | EV-UNIT-005 | commit-05-b |
| GATE-CHAT-P-034 | ResumeChangeContext / AC-CHAT-004 | TC-PROTO-067, TC-PROTO-068, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-035 | RequeryAfterGap / AC-CHAT-004 | TC-PROTO-069, TC-PROTO-070, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-036 | ResolveUnknownAttempt / AC-CHAT-003 | TC-PROTO-071, TC-PROTO-072, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-SDK-001 | commit-04-a, commit-07-a, commit-07-b |
| GATE-CHAT-P-037 | RefreshStaleMaterial / AC-CHAT-004 | TC-PROTO-073, TC-PROTO-074, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-038 | RestoreAfterShellRestart / AC-CHAT-004 | TC-PROTO-075, TC-PROTO-076, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-b, commit-07-a, commit-07-b |
| GATE-CHAT-P-039 | PersistLocalProjection / AC-CHAT-004 | TC-PROTO-077, TC-PROTO-078 | EV-UNIT-004 | commit-02-b |
| GATE-CHAT-P-040 | EvictLocalMaterial / AC-CHAT-004 | TC-PROTO-079, TC-PROTO-080 | EV-UNIT-004 | commit-02-b |
| GATE-CHAT-P-041 | EmitDiagnosticHandoff / AC-FR-CHAT-009 | TC-PROTO-081, TC-PROTO-082 | EV-UNIT-005 | commit-05-b |
| GATE-CHAT-P-042 | NavigateProjectContext / AC-FR-CHAT-011 | TC-PROTO-083, TC-PROTO-084 | EV-UI-002 | commit-06-a |
| GATE-CHAT-P-043 | UpdateDirectorySearch / AC-FR-CHAT-014 | TC-PROTO-085, TC-PROTO-086 | EV-UI-003 | commit-06-c |
| GATE-CHAT-S-001 | RouteContext / RoutePhase / AC-CHAT-005 | TC-STATE-001, TC-STATE-002, TC-STATE-003 | EV-UNIT-003 | commit-02-a |
| GATE-CHAT-S-002 | AccessPosture / AccessAvailability / AC-CHAT-005 | TC-STATE-004, TC-STATE-005, TC-STATE-006 | EV-UNIT-003 | commit-02-a |
| GATE-CHAT-S-003 | ClientConsumptionContext / ConsumptionContextPosture / AC-CHAT-005 | TC-STATE-007, TC-STATE-008, TC-STATE-009 | EV-UNIT-003 | commit-02-a |
| GATE-CHAT-S-004 | SelectionState / SelectionPhase / AC-CHAT-005 | TC-STATE-010, TC-STATE-011, TC-STATE-012 | EV-UI-002 | commit-03-a |
| GATE-CHAT-S-005 | ProjectNavigationState / SelectionPhase / AC-CHAT-005 | TC-STATE-013, TC-STATE-014, TC-STATE-015 | EV-UI-002 | commit-06-a |
| GATE-CHAT-S-006 | ProjectDetailViewModel / PageLoadPosture / AC-CHAT-005 | TC-STATE-016, TC-STATE-017, TC-STATE-018 | EV-UI-002 | commit-06-a |
| GATE-CHAT-S-007 | ProcessFlowViewModel / PageLoadPosture / AC-CHAT-005 | TC-STATE-019, TC-STATE-020, TC-STATE-021 | EV-UI-002 | commit-06-b |
| GATE-CHAT-S-008 | ProcessNodeDetailViewModel / PageLoadPosture / AC-CHAT-005 | TC-STATE-022, TC-STATE-023, TC-STATE-024 | EV-UI-002 | commit-06-b |
| GATE-CHAT-S-009 | ProjectConversationLinkViewModel / PageLoadPosture / AC-CHAT-005 | TC-STATE-025, TC-STATE-026, TC-STATE-027 | EV-UI-003 | commit-06-c |
| GATE-CHAT-S-010 | CompanyDirectoryViewModel / PageLoadPosture / AC-CHAT-005 | TC-STATE-028, TC-STATE-029, TC-STATE-030 | EV-UI-003 | commit-06-c |
| GATE-CHAT-S-011 | DraftState / DraftPhase / AC-CHAT-005 | TC-STATE-031, TC-STATE-032, TC-STATE-033 | EV-UNIT-001 | commit-04-a |
| GATE-CHAT-S-012 | CommandAttemptState / CommandResultPosture / AC-CHAT-005 | TC-STATE-034, TC-STATE-035, TC-STATE-036 | EV-UNIT-001 | commit-04-a |
| GATE-CHAT-S-013 | FreshnessMarker / FreshnessState / AC-CHAT-005 | TC-STATE-037, TC-STATE-038, TC-STATE-039 | EV-UNIT-002 | commit-02-b |
| GATE-CHAT-S-014 | SafeMaterialSnapshot / DisclosurePosture / AC-CHAT-005 | TC-STATE-040, TC-STATE-041, TC-STATE-042 | EV-UNIT-004 | commit-02-b |
| GATE-CHAT-S-015 | ContinuityState / ContinuityPhase / AC-CHAT-005 | TC-STATE-043, TC-STATE-044, TC-STATE-045 | EV-UNIT-002 | commit-05-a |
| GATE-CHAT-S-016 | LocalProjectionEntry / LocalProjectionState / AC-CHAT-005 | TC-STATE-046, TC-STATE-047, TC-STATE-048 | EV-UNIT-004 | commit-02-b |
| GATE-CHAT-S-017 | PlatformCapabilityState / CapabilityAvailability / AC-CHAT-005 | TC-STATE-049, TC-STATE-050, TC-STATE-051 | EV-NATIVE-001 | commit-08-a |
| GATE-CHAT-TX-001 | root/repo原子性 / AC-NFR-CHAT-005 | TC-CONC-001, TC-CONC-006, TC-CONC-007, TC-CONC-009, TC-CONC-010, TC-CONC-013, TC-CONC-014 | EV-UNIT-001, EV-UNIT-002, EV-UNIT-004, EV-UI-002 | commit-04-a, commit-05-a, commit-06-b, commit-02-b, commit-05-b |
| GATE-CHAT-CONC-001 | 双提交 / AC-NFR-CHAT-005 | TC-CONC-001 | EV-UNIT-001 | commit-04-a |
| GATE-CHAT-CONC-002 | 改稿 / AC-NFR-CHAT-005 | TC-CONC-002 | EV-UNIT-001 | commit-04-a |
| GATE-CHAT-CONC-003 | Gate重复 / AC-NFR-CHAT-005 | TC-CONC-003 | EV-UNIT-001 | commit-04-a |
| GATE-CHAT-CONC-004 | association / AC-NFR-CHAT-005 | TC-CONC-004 | EV-UNIT-001 | commit-04-a |
| GATE-CHAT-CONC-005 | result/probe / AC-NFR-CHAT-005 | TC-CONC-005 | EV-UNIT-001 | commit-04-a |
| GATE-CHAT-CONC-006 | change/resume / AC-NFR-CHAT-005 | TC-CONC-006 | EV-UNIT-002 | commit-05-a |
| GATE-CHAT-CONC-007 | late读取 / AC-NFR-CHAT-005 | TC-CONC-007 | EV-UI-002 | commit-06-b |
| GATE-CHAT-CONC-008 | 父图更新 / AC-NFR-CHAT-005 | TC-CONC-008 | EV-UI-002 | commit-06-b |
| GATE-CHAT-CONC-009 | 撤销 / AC-NFR-CHAT-005 | TC-CONC-009 | EV-UNIT-002 | commit-05-a |
| GATE-CHAT-CONC-010 | save/登出 / AC-NFR-CHAT-005 | TC-CONC-010 | EV-UNIT-004 | commit-02-b |
| GATE-CHAT-CONC-011 | resume重入 / AC-NFR-CHAT-005 | TC-CONC-011 | EV-UNIT-002 | commit-05-a |
| GATE-CHAT-CONC-012 | 跨设备 / AC-NFR-CHAT-005 | TC-CONC-012, TC-REAL-001, TC-REAL-004 | EV-UNIT-002, EV-SDK-001 | commit-05-a, commit-07-a, commit-07-b |
| GATE-CHAT-CONC-013 | 有界消费 / AC-NFR-CHAT-005 | TC-CONC-013 | EV-UNIT-002 | commit-05-b |
| GATE-CHAT-CONC-014 | dispose晚到 / AC-NFR-CHAT-005 | TC-CONC-014 | EV-UNIT-002 | commit-05-b |
| GATE-CHAT-ERROR-001 | 全错误/安全retry / AC-NFR-CHAT-003 | TC-ERROR-001, TC-ERROR-002, TC-ERROR-003, TC-ERROR-004, TC-ERROR-005, TC-ERROR-006, TC-ERROR-007, TC-ERROR-008, TC-ERROR-009, TC-ERROR-010, TC-ERROR-011, TC-ERROR-012, TC-ERROR-013, TC-ERROR-014, TC-ERROR-015 | EV-UNIT-007 | commit-09-a |
| GATE-CHAT-NFR-001 | 响应/请求有界 / AC-NFR-CHAT-001 | TC-SAFE-009, TC-SAFE-010, TC-CONC-011, TC-CONC-013, TC-PROTO-072 | EV-UNIT-001, EV-UI-001, EV-UNIT-002 | commit-03-a, commit-05-a, commit-05-b, commit-04-a |
| GATE-CHAT-NFR-002 | fail-closed/局部可用与恢复 / AC-NFR-CHAT-002 | TC-PROTO-016, TC-PROTO-054, TC-PROTO-056, TC-PROTO-076, TC-SAFE-002, TC-CONC-009, TC-REAL-001, TC-REAL-004 | EV-UI-001, EV-UNIT-002, EV-UNIT-003, EV-SDK-001 | commit-03-b, commit-05-a, commit-05-b, commit-02-a, commit-07-a, commit-07-b |
| GATE-CHAT-NFR-003 | 安全/边界/配置 / AC-NFR-CHAT-003 | TC-SAFE-001, TC-SAFE-002, TC-SAFE-004, TC-CFG-002, TC-CFG-004, TC-CFG-010, TC-CFG-012 | EV-UNIT-003, EV-UNIT-004, EV-NATIVE-001, EV-UNIT-006, EV-UNIT-008 | commit-01-a, commit-02-a, commit-02-b, commit-08-a |
| GATE-CHAT-NFR-004 | 安全回链/审计证据 / AC-NFR-CHAT-004 | TC-PROTO-052, TC-SAFE-005, TC-REPORT-001, TC-REPORT-002, TC-REPORT-004, TC-REPORT-007, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-UI-002, EV-REPORT-001, EV-SDK-001 | commit-04-a, commit-06-b, commit-09-b, commit-07-a, commit-07-b |
| GATE-CHAT-NFR-005 | 一致性/幂等/跨端 / AC-NFR-CHAT-005 | TC-CONC-001, TC-CONC-006, TC-CONC-010, TC-CONC-012, TC-CONC-013, TC-PROTO-072, TC-REAL-001, TC-REAL-004 | EV-UNIT-001, EV-UNIT-002, EV-UNIT-004, EV-SDK-001 | commit-04-a, commit-05-a, commit-02-b, commit-05-b, commit-07-a, commit-07-b |
| GATE-CHAT-NFR-006 | 低敏分类/可观测 / AC-NFR-CHAT-006 | TC-PROTO-064, TC-PROTO-066, TC-PROTO-082, TC-CFG-021, TC-CFG-022 | EV-UNIT-005 | commit-05-b |
| GATE-CHAT-NFR-007 | AT/平台等价 / AC-NFR-CHAT-007 | TC-AT-001, TC-AT-002, TC-AT-003, TC-AT-004, TC-AT-005, TC-REAL-002, TC-REAL-003, TC-SAFE-007, TC-SAFE-008 | EV-UI-001, EV-NATIVE-001, EV-HOST-001, EV-AT-001 | commit-03-a, commit-06-b, commit-03-b, commit-08-b, commit-08-a |
| GATE-CHAT-E-001 | EV-UNIT-001 / intent / AC-NFR-CHAT-004 | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-019, TC-PROTO-020, TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-STATE-031, TC-STATE-032, TC-STATE-033, TC-STATE-034, TC-STATE-035, TC-STATE-036, TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-SAFE-003 | EV-UNIT-001 | commit-04-a, commit-04-b |
| GATE-CHAT-E-002 | EV-UI-001 / presentation / AC-NFR-CHAT-004 | TC-PROTO-005, TC-PROTO-006, TC-PROTO-011, TC-PROTO-012, TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-031, TC-PROTO-032, TC-SAFE-008, TC-SAFE-009, TC-AT-001, TC-AT-002, TC-AT-003, TC-AT-004, TC-AT-005 | EV-UI-001 | commit-04-a, commit-03-a, commit-03-b, commit-06-b |
| GATE-CHAT-E-003 | EV-UNIT-002 / continuity / AC-NFR-CHAT-004 | TC-PROTO-007, TC-PROTO-008, TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-PROTO-059, TC-PROTO-060, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-073, TC-PROTO-074, TC-PROTO-075, TC-PROTO-076, TC-STATE-037, TC-STATE-038, TC-STATE-039, TC-STATE-043, TC-STATE-044, TC-STATE-045, TC-CONC-006, TC-CONC-009, TC-CONC-011, TC-CONC-012, TC-CONC-013, TC-CONC-014, TC-SAFE-010 | EV-UNIT-002 | commit-05-b, commit-05-a, commit-02-b |
| GATE-CHAT-E-004 | EV-UNIT-003 / navigation / AC-NFR-CHAT-004 | TC-PROTO-009, TC-PROTO-010, TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004, TC-STATE-005, TC-STATE-006, TC-STATE-007, TC-STATE-008, TC-STATE-009, TC-SAFE-002 | EV-UNIT-003 | commit-02-a |
| GATE-CHAT-E-005 | EV-UNIT-004 / persistence / AC-NFR-CHAT-004 | TC-PROTO-025, TC-PROTO-026, TC-PROTO-027, TC-PROTO-028, TC-PROTO-061, TC-PROTO-062, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-STATE-040, TC-STATE-041, TC-STATE-042, TC-STATE-046, TC-STATE-047, TC-STATE-048, TC-CONC-010, TC-SAFE-004 | EV-UNIT-004 | commit-02-b, commit-04-a |
| GATE-CHAT-E-006 | EV-NATIVE-001 / host-unit / AC-NFR-CHAT-004 | TC-PROTO-029, TC-PROTO-030, TC-STATE-049, TC-STATE-050, TC-STATE-051, TC-CFG-011, TC-CFG-012, TC-SAFE-007 | EV-NATIVE-001 | commit-08-a |
| GATE-CHAT-E-007 | EV-UI-002 / process / AC-NFR-CHAT-004 | TC-PROTO-033, TC-PROTO-034, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-083, TC-PROTO-084, TC-STATE-010, TC-STATE-011, TC-STATE-012, TC-STATE-013, TC-STATE-014, TC-STATE-015, TC-STATE-016, TC-STATE-017, TC-STATE-018, TC-STATE-019, TC-STATE-020, TC-STATE-021, TC-STATE-022, TC-STATE-023, TC-STATE-024, TC-CFG-019, TC-CFG-020, TC-CONC-007, TC-CONC-008, TC-SAFE-005 | EV-UI-002 | commit-06-a, commit-06-b, commit-03-a |
| GATE-CHAT-E-008 | EV-UI-003 / directory / AC-NFR-CHAT-004 | TC-PROTO-043, TC-PROTO-044, TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-PROTO-085, TC-PROTO-086, TC-STATE-025, TC-STATE-026, TC-STATE-027, TC-STATE-028, TC-STATE-029, TC-STATE-030, TC-SAFE-006 | EV-UI-003 | commit-06-c |
| GATE-CHAT-E-009 | EV-UNIT-005 / diagnostic / AC-NFR-CHAT-004 | TC-PROTO-063, TC-PROTO-064, TC-PROTO-065, TC-PROTO-066, TC-PROTO-081, TC-PROTO-082, TC-CFG-021, TC-CFG-022 | EV-UNIT-005 | commit-05-b |
| GATE-CHAT-E-010 | EV-UNIT-006 / config / AC-NFR-CHAT-004 | TC-CFG-001, TC-CFG-002, TC-CFG-003, TC-CFG-004, TC-CFG-005, TC-CFG-006, TC-CFG-007, TC-CFG-008, TC-CFG-009, TC-CFG-010, TC-CFG-013, TC-CFG-014, TC-CFG-015, TC-CFG-016, TC-CFG-017, TC-CFG-018, TC-CFG-023, TC-CFG-024 | EV-UNIT-006 | commit-01-a |
| GATE-CHAT-E-011 | EV-UNIT-007 / errors / AC-NFR-CHAT-004 | TC-ERROR-001, TC-ERROR-002, TC-ERROR-003, TC-ERROR-004, TC-ERROR-005, TC-ERROR-006, TC-ERROR-007, TC-ERROR-008, TC-ERROR-009, TC-ERROR-010, TC-ERROR-011, TC-ERROR-012, TC-ERROR-013, TC-ERROR-014, TC-ERROR-015 | EV-UNIT-007 | commit-09-a |
| GATE-CHAT-E-012 | EV-UNIT-008 / boundary / AC-NFR-CHAT-004 | TC-SAFE-001 | EV-UNIT-008 | commit-01-a |
| GATE-CHAT-E-013 | EV-REPORT-001 / report / AC-NFR-CHAT-004 | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 | EV-REPORT-001 | commit-09-b |
| GATE-CHAT-E-014 | EV-SDK-001 / sdk-real / AC-NFR-CHAT-004 | TC-REAL-001, TC-REAL-004 | EV-SDK-001 | commit-07-a, commit-07-b |
| GATE-CHAT-E-015 | EV-HOST-001 / desktop-real / AC-NFR-CHAT-004 | TC-REAL-002 | EV-HOST-001 | commit-08-b |
| GATE-CHAT-E-016 | EV-AT-001 / at-real / AC-NFR-CHAT-004 | TC-REAL-003 | EV-AT-001 | commit-08-b |
| GATE-CHAT-E-017 | schema/digest/分母/成熟度 / AC-NFR-CHAT-004 | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 | EV-REPORT-001 | commit-09-b |
| GATE-CHAT-E-018 | acceptance交接/审阅完整 / AC-CHAT-005 | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 | EV-REPORT-001 | commit-09-b, commit-10-a, commit-10-b |
| VETO-CHAT-001 | 旁路/ownertruth替代 / 一票否决，无新AC | TC-SAFE-001, TC-SAFE-005, TC-PROTO-044 | EV-UI-002, EV-UI-003, EV-UNIT-008 | commit-01-a, commit-06-b, commit-06-c, commit-10-a, commit-10-b |
| VETO-CHAT-002 | 资格失效仍披露/动作 / 一票否决，无新AC | TC-SAFE-002, TC-PROTO-010, TC-PROTO-020, TC-PROTO-056, TC-CONC-009 | EV-UNIT-001, EV-UNIT-002, EV-UNIT-003 | commit-02-a, commit-04-a, commit-05-a, commit-10-a, commit-10-b |
| VETO-CHAT-003 | 假业务确认/unknown重放 / 一票否决，无新AC | TC-SAFE-003, TC-PROTO-002, TC-PROTO-004, TC-PROTO-022, TC-PROTO-052, TC-PROTO-072, TC-CONC-001 | EV-UNIT-001 | commit-04-a, commit-04-b, commit-10-a, commit-10-b |
| VETO-CHAT-004 | secret/forbiddenbody泄露 / 一票否决，无新AC | TC-SAFE-004, TC-REPORT-003, TC-REPORT-005, TC-PROTO-064, TC-PROTO-066, TC-PROTO-082 | EV-UNIT-004, EV-UNIT-005, EV-REPORT-001 | commit-02-b, commit-09-b, commit-05-b, commit-10-a, commit-10-b |
| VETO-CHAT-005 | 显示/指标伪审批/完成truth / 一票否决，无新AC | TC-SAFE-005, TC-PROTO-038, TC-PROTO-040, TC-PROTO-042, TC-PROTO-044, TC-PROTO-048 | EV-UI-002, EV-UI-003 | commit-06-b, commit-06-c, commit-10-a, commit-10-b |
| VETO-CHAT-006 | 缺口/失败/旧授权掩盖 / 一票否决，无新AC | TC-PROTO-054, TC-PROTO-056, TC-PROTO-070, TC-PROTO-074, TC-PROTO-076, TC-PROTO-080, TC-CONC-006, TC-CONC-009, TC-CONC-010, TC-CONC-013 | EV-UNIT-002, EV-UNIT-004 | commit-05-a, commit-05-b, commit-02-b, commit-10-a, commit-10-b |
| VETO-CHAT-007 | 核心键盘/AT不可用被忽略 / 一票否决，无新AC | TC-AT-001, TC-AT-002, TC-AT-003, TC-AT-004, TC-AT-005, TC-REAL-002, TC-REAL-003 | EV-UI-001, EV-HOST-001, EV-AT-001 | commit-03-a, commit-06-b, commit-03-b, commit-08-b, commit-10-a, commit-10-b |
| VETO-CHAT-008 | 伪造证据/索引/署名 / 一票否决，无新AC | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-006, TC-REPORT-007 | EV-REPORT-001 | commit-09-b, commit-10-a, commit-10-b |
| VETO-CHAT-009 | 硬门禁/risk越权放行 / 一票否决，无新AC | TC-REPORT-004, TC-REPORT-005, TC-REPORT-007, TC-SAFE-001, TC-SAFE-002, TC-SAFE-003, TC-REAL-001, TC-REAL-002, TC-REAL-003, TC-REAL-004 | EV-UNIT-001, EV-UNIT-003, EV-UNIT-008, EV-REPORT-001, EV-SDK-001, EV-HOST-001, EV-AT-001 | commit-09-b, commit-01-a, commit-02-a, commit-04-a, commit-07-a, commit-08-b, commit-07-b, commit-10-a, commit-10-b |
| VETO-CHAT-010 | 非法配置/虚假能力激活 / 一票否决，无新AC | TC-CFG-002, TC-CFG-004, TC-CFG-006, TC-CFG-008, TC-CFG-010, TC-CFG-012, TC-CFG-014, TC-CFG-016, TC-CFG-024 | EV-NATIVE-001, EV-UNIT-006 | commit-01-a, commit-08-a, commit-10-a, commit-10-b |

### 7.5 脚本、报告成熟度与归档

保留05 §9.3原CLI，不加可绕过批准的--mode，不更换run-root或reports参数。以下都是未来planned命令，当前未运行。

```sh
scripts/gates/run_ci_gate.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile desktop-ci
scripts/checks/check_redaction.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --report-root reports/runs/<run_id>
scripts/reports/generate_reports.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --report-root reports/runs/<run_id>
scripts/checks/check_redaction.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --report-root reports/runs/<run_id>
```

gate实际runner→安全machine artifacts→首次machine redaction→候选index/Markdown→final redaction→可审阅report；失败nonzero，不因缺前置造执行case。reader核05 chat.test.v1严格schema、manifest exactmatch、JSON selfdigest与FileRef bytesdigest、same-run/path/root与source；RFC8785采用经核验成熟实现，sha256仅对规定canonical或storedbytes，不能手写字符串排序。run_id固定且唯一，不用latest、不覆盖失败run，不跨OS/构建拼参数或以截图替代断言。

| boundary / phase | 允许成熟度 | 必需真实输入/输出 | 审查责任/禁止 |
|---|---|---|---|
| 01-a | script_capability | 仅当前source/config检查，尚无正式run | actual命令记录；不造index/EV |
| 01-b～09-a | index_shell | 若actualrun则当前machine/完整expected与缺失、最小index；detail_ref=null | test负责人核切口/分母、reviewer核不足；缺后序族完整gateblocked，不生成16EVdetail |
| 09-b | full_ev | actualcomplete各层run；16EV固定映射、完整detail/index与缺口 | 测试/SDK/native/安全/质量负责人actualreview；failed/blocked如实，不产生验收通过 |
| 10-a/b | acceptance_handoff | approved同baseline fullEV；06私有DTO和固定acceptance候选 | 生成器只draft/reviewing，风险与六角色签署均来自实际审阅；未授发布不release |

授权成熟度同时满足approved design07当前boundary、项目台账actual Design/Scope Gate与RunContext.authorized_maturity；脚本不能从boundary名字/目录自行升级。index_shell不改05预约EV tc_refs；fullEV tc_refs严格等于05原映射，包括当前尚未完成的参数，缺参必须blocked/failed。

### 7.6 验收私有writer与审阅交接

不新增generate_acceptance_handoff.sh；按06既定generate_reports.sh及相同参数，在authorized_maturity=acceptance_handoff且10-a获批准时调用私有acceptance_writer.ts，只产生待审初稿。check_redaction.sh到10-a需扩检本review引用的acceptance候选及实际archive、签署前final安全检查；此内容scope随10-a受控打开。

reports/acceptance固定handoff.md、veto-checklist.md、risk-acceptance.md、open-issues.md、baseline.json；reports/review包含实际reviewer-notes.md、agent-review.md（只有实际审阅才记录）。人/Agent补事实范围、未跑tests、剩余blocker、缺陷/风险与角色引用；JSON和Markdown同步后重算digest，不手改test结果。

ExpectedInstance由冻结manifest期望集合得出，actual CaseInstance/FileRef仅由真实machine得出；缺文件不补actualref。06 baseline_input_digest保留nested input digest、FileRef和规则/build摘要，不递归删digest；E018检查签署前输入和实际审阅，不依赖最终signoffs，先固定输入/Markdownbytesrefs→inputdigest→六签署→finalselfdigest；任何输入变化重算重签。stage draft/reviewing的final_verdict=null、next_stage=not_allowed；writer不自动clearVETO/接受risk/代签。

TC-REPORT既有参数扩到acceptance后EV-REPORT-001重新实际运行，加入批准同baseline run_ids按其自己的manifest/ref取证，不能把旧09-b run覆盖或篡改。目录/OS矩阵可多个明确列举actualrun，但同一实例不能跨run拼失败片段为pass；真实审阅与签署记录必须同inputdigest。

### 7.7 失败、缺口与停审

P0 failed/blocked/skipped/not_run/missing/unsafe或参数覆盖不足一律阻断相应测试/验收gate；局部通过不豁免未完成真实层、预算、source/版本、ACL/保留或BASE001。异常有限分类无rawbody/stack；取消/崩溃只有actualrunner上下文才可记录，未启动无虚构duration/assertion。

自动工具查schema/digest/path/import/config/manifest，实际测试查行为/层；安全review核脱敏与owner红线，OS/AT operator核真实体验；治理/产品/测试/实现/安全与用户角色按06签署，身份未定继续waiting。遇设计冲突wait_design，遇当前实现失败只fix_gate_failure且scope内修复；每次门禁、报告或参数变化复核当前boundary及下游受影响matrix，不沿用旧pass。

### 本Step过程审查（不进正式正文）

#### 门禁逐boundary设计停审

| boundary | 当前测试/证据/AC/VETO/成熟度审查 | 结论/保留 |
|---|---|---|
| commit-01-a | assignedTC=19；EV关联=2；gate关联=17；script_capability；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-01-b | assignedTC=0；EV关联=0；gate关联=0；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-02-a | assignedTC=12；EV关联=1；gate关联=12；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-02-b | assignedTC=19；EV关联=2；gate关联=19；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-03-a | assignedTC=14；EV关联=2；gate关联=17；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-03-b | assignedTC=5；EV关联=1；gate关联=13；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-04-a | assignedTC=26；EV关联=3；gate关联=35；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-04-b | assignedTC=2；EV关联=1；gate关联=7；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-05-a | assignedTC=22；EV关联=1；gate关联=30；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-05-b | assignedTC=18；EV关联=2；gate关联=27；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-06-a | assignedTC=12；EV关联=1；gate关联=8；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-06-b | assignedTC=18；EV关联=2；gate关联=21；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-06-c | assignedTC=15；EV关联=1；gate关联=17；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-07-a | assignedTC=1；EV关联=1；gate关联=60；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-07-b | assignedTC=1；EV关联=1；gate关联=60；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-08-a | assignedTC=8；EV关联=1；gate关联=9；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-08-b | assignedTC=2；EV关联=2；gate关联=11；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-09-a | assignedTC=15；EV关联=1；gate关联=2；index_shell；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-09-b | assignedTC=7；EV关联=1；gate关联=8；full_ev；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-10-a | assignedTC=0；EV关联=0；gate关联=12；acceptance_handoff；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |
| commit-10-b | assignedTC=0；EV关联=0；gate关联=12；acceptance_handoff；currentvariant+后序缺口如实 | reviewed_design_with_blockers；实际gate全未执行 |

#### 跨门禁审计

| 审计项 | 结果 | 保留 |
|---|---|---|
| TC集合 | 216唯一primary责任、43协议86TC、17主体51TC和其它族不增不减 | early primary不等全variant完成，09-a冻结完整 |
| EV/suite | 16一一固定、每TC属于其原suite/EV、host-unit联合engine | formal/native/manual四realTC仍blocked |
| 142P0与10VETO | 全152行逐项映射，36actualparent不扩号 | CHAT-BASE-001继续open；不得用未注册AC-NFR008～024 |
| mature/report | 01-a capability、01-b～09-a index、09-b fullEV、10-a acceptance | approvedboundary+RunContext，而非可改mode |
| scripts/DAG | 三CLI/双redaction同05；source→machine→report→final | 10-a受控增加acceptance checks，新增schema不改05 |
| E018/签署 | 前置review→inputdigest→六签署→final，无cycle | actualrole/ref/signature未有 |
| 失败归属 | gate/suite/case exactscope；failed/blocked/缺参不pass | currenttargeted只能本层，不绕fullPR/real |


## 8. 回填草稿

正式07 §7仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

216TC注册集合/43protocol/17state逐项映射、16suiteEV原scope、142gate及10VETO全行映射，成熟度/文件roots/DAG/实际审查责任和失败口径静态有效。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step8读取对应规范和来源。
