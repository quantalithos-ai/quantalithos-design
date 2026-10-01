# L5-chat 05 · Step 3 测试对象与测试切口

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step2；05 SOP Step3与书写规范5.3；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

哪些模块、接口、状态、事务/一致性、错误、配置与边界可测？§3.1～4给出入口与覆盖单位；具体步骤后续Step6。

## 4. 当前文档问题诊断

仅模块清单无法保证43个接口都有验证入口，共享enum会遮蔽五个page独立行为。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 仅模块清单无法保证43个接口都有验证入口，共享enum会遮蔽五个page独立行为。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

逐protocol与state小循环，局部表明确异常和后续编号；不从旧05大表迁移对象。

## 7. 结构化中间产物

### 3.1 模块到测试入口

| 模块 | planned源文件 | 对象/切口 |
|---|---|---|
| app/config/sdk | tests/sdk_binding_tests.ts | startup全量immutable、strict配置、SDK注册资格、依赖禁止 |
| navigation | tests/navigation_boundary_tests.ts | actor/session/fence/parent/入口访问 |
| collaboration/platform | tests/presentation_accessibility_tests.tsx | Turn类型、GateCard/Artifact、键盘/ARIA、图/列表等价 |
| collaboration项目 | tests/project_process_boundary_tests.tsx | 五tab/whole-stage-node、safe fork/join/loop |
| collaboration关系/目录 | tests/directory_relationship_boundary_tests.tsx | source关系、target access、人类/AI provider、分页代次 |
| intents | tests/intent_result_tests.ts | draft/attempt/双reservation/formal result |
| continuity | tests/continuity_recovery_tests.ts | source cursor/gap/coverage/singleflight |
| materials/local_state | tests/persistence_boundary_tests.ts | safe材料、root CAS、内存repo/delete/revoke |
| native_host | src-tauri/tests/platform_boundary_tests.rs | origin/window/kind guard与finite error |

### 3.2 协议cut逐项拆解

每行先核对03 Step8/9同名卡→定位输入资格与风险→选择local fixture入口/real binding入口→审查成对断言→收口。Query不得写owner；local patch只在完整current checks成立。消费/jobs同样有正反向入口。

| cut | 协议 | 正向最小观察 | 异常最小观察 | 后续用例族 |
|---|---|---|---|---|
| CUT-P-01 | SubmitConversationIntent | 冻结当前draft→预留→单dispatch→formal confirmed，只清同revision | 双击/IME/ACK/断线unknown，新稿不被旧确认清 | TC-PROTO-001/TC-PROTO-002 |
| CUT-P-02 | SubmitGovernanceIntent | formal Gate/action capability→single dispatch→正式结果反馈 | 点击/transport不确认，Gate capability撤销/unknown不重发 | TC-PROTO-003/TC-PROTO-004 |
| CUT-P-03 | RequestSafePreview | 正式无effect安全preview query | 有副作用能力/未bound/hidden禁止open | TC-PROTO-005/TC-PROTO-006 |
| CUT-P-04 | AcknowledgeLocalRecoveryAction | current source下允许resume/requery/probe/clear | 非法action或unknown resend拒绝 | TC-PROTO-007/TC-PROTO-008 |
| CUT-P-05 | ResolveEntryAccess | group/channel/dm/thread与项目/目录入口正式资格解析 | 深链伪actor/无parent/旧epoch/hidden不泄露 | TC-PROTO-009/TC-PROTO-010 |
| CUT-P-06 | LoadConversationSurface | qualifiedsafe surface一次current CAS | 切换会话后late response不覆写，hidden清refs | TC-PROTO-011/TC-PROTO-012 |
| CUT-P-07 | LoadTurnPage | SDK排序/page lineage正向，Turn类型安全分派 | 未知category/错cursor lineage/旧页/无限分页拒绝 | TC-PROTO-013/TC-PROTO-014 |
| CUT-P-08 | LoadOwnerSummary | source provenance/freshness独立保持 | raw body/跨owner版本/无visibility拒绝 | TC-PROTO-015/TC-PROTO-016 |
| CUT-P-09 | LoadArtifactPreview | safe ref→正式preview descriptor | 过期/撤销/unsupported清openRef，不拼URL | TC-PROTO-017/TC-PROTO-018 |
| CUT-P-10 | LoadIntentCapability | 当前actor/scope/intent/Gate正式能力 | 缓存/host available不授予提交 | TC-PROTO-019/TC-PROTO-020 |
| CUT-P-11 | ProbeCommandAttempt | matched formal probe收敛unknown | not_found无no-effect仍unknown，错association拒绝 | TC-PROTO-021/TC-PROTO-022 |
| CUT-P-12 | LoadResumeContext | 当前单source恢复候选 | 跨source/cursor字符串排序/旧request拒绝 | TC-PROTO-023/TC-PROTO-024 |
| CUT-P-13 | LoadLocalProjection | 同partition load含entry版/null | 错partition不泄露存在性，cache不授权 | TC-PROTO-025/TC-PROTO-026 |
| CUT-P-14 | LoadDraft | 当前context内存稿/root版 | 项目/目录伪Conversation/跨scope稿拒绝 | TC-PROTO-027/TC-PROTO-028 |
| CUT-P-15 | ProbePlatformCapability | 四host能力各自probe姿态 | 假origin/旧window/无合同unknown，不授予业务权 | TC-PROTO-029/TC-PROTO-030 |
| CUT-P-16 | LoadAccessibilityContext | safe page派生region/focus/announcement | 隐藏label/count/边不能出现在AT，失效焦点转安全区 | TC-PROTO-031/TC-PROTO-032 |
| CUT-P-17 | LoadProjectList | 正式Work项目safe页与page info | 空页不推项目不存在；旧搜索/页拒绝 | TC-PROTO-033/TC-PROTO-034 |
| CUT-P-18 | LoadProjectDetail | 五tab、各sourcesection与返回语境 | 顶层progress不存在，partial不混成全owner fresh | TC-PROTO-035/TC-PROTO-036 |
| CUT-P-19 | LoadProjectProcessFlow | Process整体safe topology/版本/并行gateway | 从WorkItem/log/prototype补图拒绝，hidden边裁剪 | TC-PROTO-037/TC-PROTO-038 |
| CUT-P-20 | LoadStageProcessFlow | matchedparent进入独立阶段流程 | 父版本变化/阶段迟到清旧child，无伪汇聚 | TC-PROTO-039/TC-PROTO-040 |
| CUT-P-21 | LoadProcessNodeDetail | 当前safe节点的工作/运行/工具/提交/测试/证据独立section | 旧node返回拒绝；safe摘要不等验收evidence | TC-PROTO-041/TC-PROTO-042 |
| CUT-P-22 | LoadProjectConversationLinks | 正式关系和每个target独立access | 解除/撤销/不同群成员不串权；本地不建binding | TC-PROTO-043/TC-PROTO-044 |
| CUT-P-23 | LoadCompanyDirectory | 正式provider人类/AI覆盖/搜索/分页 | 覆盖未知/隐藏人数/跨querypage不合并，Identity不伪全目录 | TC-PROTO-045/TC-PROTO-046 |
| CUT-P-24 | LoadMemberContext | Identity/ProjectMember/Participant/presence独立 | 目录可见不授予DM/项目，Runtime summary不当presence | TC-PROTO-047/TC-PROTO-048 |
| CUT-P-25 | ConsumeFormalChange | source-qualified change一次CAS更新slice/水位 | duplicate无二次apply；gap/乱序/oldslot无fresh | TC-PROTO-049/TC-PROTO-050 |
| CUT-P-26 | ConsumeCommandReceiptOrResult | formalauthority/correlation后result gate | 普通receipt/WS/AG-UI ACK/fake不确认真实attempt | TC-PROTO-051/TC-PROTO-052 |
| CUT-P-27 | ConsumeResumeResult | current source/recovery+completecoverage才fresh | partial/错recovery/旧slots不fresh | TC-PROTO-053/TC-PROTO-054 |
| CUT-P-28 | ConsumeVisibilityChange | 当前scope/source正式revoke先隐藏失效 | closed node仍被遮蔽；stop/delete失败不回滚 | TC-PROTO-055/TC-PROTO-056 |
| CUT-P-29 | ConsumeMaterialRevisionChange | 仅matchedsource材料stale/parent失效 | 跨source不覆盖，旧revision不复活graph | TC-PROTO-057/TC-PROTO-058 |
| CUT-P-30 | ConsumeShellLifecycle | 可信host offline/background/closing技术消费 | 窗口ACK/closing不取消owner或确认业务 | TC-PROTO-059/TC-PROTO-060 |
| CUT-P-31 | ConsumeEvictionTrigger | qualifiedclearreason→先hide再repo delete | 非法触发/冲突delete不能cleared | TC-PROTO-061/TC-PROTO-062 |
| CUT-P-32 | ClientDiagnosticHandoffRequested | 显式current低敏六字段，合格sinkreceipt | disabled零IO/额外secret字段拒绝/unknown不重送 | TC-PROTO-063/TC-PROTO-064 |
| CUT-P-33 | ClientSupportContextRequested | 显式支持分类/有限reason构造 | raw logs/query/actorref/截图不能加入payload | TC-PROTO-065/TC-PROTO-066 |
| CUT-P-34 | ResumeChangeContext | 每source single-flight resume | 双resume/旧recovery/断线ACK不fresh | TC-PROTO-067/TC-PROTO-068 |
| CUT-P-35 | RequeryAfterGap | 新qualifiedsnapshot覆盖相应source | 缺coverage不能清gap/吞变更 | TC-PROTO-069/TC-PROTO-070 |
| CUT-P-36 | ResolveUnknownAttempt | 只formalprobe→合法结果轴 | not_found/timeout不自动dispatch | TC-PROTO-071/TC-PROTO-072 |
| CUT-P-37 | RefreshStaleMaterial | newcurrent source材料/marker | revoked旧ref不refresh恢复权限 | TC-PROTO-073/TC-PROTO-074 |
| CUT-P-38 | RestoreAfterShellRestart | safe locator新epoch重新入口/正式read | 旧confirmed/access/handle不恢复，memory无durable承诺 | TC-PROTO-075/TC-PROTO-076 |
| CUT-P-39 | PersistLocalProjection | 当前fence/partition/entry版memory保存 | pending save-after-revoke拒绝，正文/secret不disk | TC-PROTO-077/TC-PROTO-078 |
| CUT-P-40 | EvictLocalMaterial | deleted/already_absent→memorycleared | storage/conflict失败restricted仍隐藏 | TC-PROTO-079/TC-PROTO-080 |
| CUT-P-41 | EmitDiagnosticHandoff | 显式approved input按mode交付 | 缺sinkblocked/默认disabled/unknown no resend | TC-PROTO-081/TC-PROTO-082 |
| CUT-P-42 | NavigateProjectContext | 五tab和safe stage/node局部选择 | 旧parent/hiddennode/错误project拒绝，不能绑定群聊 | TC-PROTO-083/TC-PROTO-084 |
| CUT-P-43 | UpdateDirectorySearch | 新querygeneration登记slot并清旧page | rapidsearch late results/旧cursor不能覆写 | TC-PROTO-085/TC-PROTO-086 |

### 3.3 状态cut逐主体拆解

同一PageLoadPosture用于五个独立VM，测试不合并为一个enum case。后续§6固定源行清单与缺guard矩阵；源矩阵变更新增行必须同步测试，不用动态过滤掩盖遗漏。

| cut | 主体/enum | 合法锚点 | 非法/边界 | 后续用例族 |
|---|---|---|---|---|
| CUT-S-01 | RouteContext / RoutePhase | unresolved→resolved；expired新generation重验 | 缓存/deeplink不能直接resolved且authorized | TC-STATE-001～003 |
| CUT-S-02 | AccessPosture / AccessAvailability | 正式可读与安全收紧分别处理 | hidden不能被technical unavailable恢复 | TC-STATE-004～006 |
| CUT-S-03 | ClientConsumptionContext / ConsumptionContextPosture | active→invalidated→cleared；新slot另建 | 旧slot/mismatchedactor/source拒绝 | TC-STATE-007～009 |
| CUT-S-04 | SelectionState / SelectionPhase | empty→selected；stale/clear后新current选择 | 跨context或隐藏target不选中 | TC-STATE-010～012 |
| CUT-S-05 | ProjectNavigationState / SelectionPhase | safeproject五tab/整体→stage→node选择 | 旧parent/不获准node不能进入 | TC-STATE-013～015 |
| CUT-S-06 | ProjectDetailViewModel / PageLoadPosture | loading→ready/partial，变化→stale，revoke→blocked | 混合source不可一次fresh，failLoad不覆盖新generation | TC-STATE-016～018 |
| CUT-S-07 | ProcessFlowViewModel / PageLoadPosture | 正式拓扑loading→ready/partial；父变化stale | 无source/不兼容版本不ready | TC-STATE-019～021 |
| CUT-S-08 | ProcessNodeDetailViewModel / PageLoadPosture | 当前node section loading→ready/partial | late node不覆写，hidden引用清理 | TC-STATE-022～024 |
| CUT-S-09 | ProjectConversationLinkViewModel / PageLoadPosture | 正式关系+target各access→ready/partial | 本地binding不ready，解除清目标 | TC-STATE-025～027 |
| CUT-S-10 | CompanyDirectoryViewModel / PageLoadPosture | newquery→loading→ready/partial | oldpage lineage不ready，不猜coverage | TC-STATE-028～030 |
| CUT-S-11 | DraftState / DraftPhase | editing→locally_valid→submitting；失败release后editing再验 | unknown/pending不能释放旧submitting用于重发 | TC-STATE-031～033 |
| CUT-S-12 | CommandAttemptState / CommandResultPosture | draft→submitted→pending/confirmed或unknown→probe | ACK不能confirmed，unknown无automatic_retry，terminal不反转 | TC-STATE-034～036 |
| CUT-S-13 | FreshnessMarker / FreshnessState | 正式sourcecoverage更新；过期/stale收紧 | cache/arrival/跨source成功不fresh | TC-STATE-037～039 |
| CUT-S-14 | SafeMaterialSnapshot / DisclosurePosture | 按正式visibility允许→收紧/cleared | 未知/撤销内容不展示，不可降级还保留title | TC-STATE-040～042 |
| CUT-S-15 | ContinuityState / ContinuityPhase | stale/gap→resuming→formalcoverage fresh | reconnecting或单event不清gap | TC-STATE-043～045 |
| CUT-S-16 | LocalProjectionEntry / LocalProjectionState | cached→restored/stale；evicting→confirmeddelete cleared | failed delete不cleared，restored不authorized/fresh | TC-STATE-046～048 |
| CUT-S-17 | PlatformCapabilityState / CapabilityAvailability | 每capability独立probe五态 | 无host proof不available，host可用不intent可用 | TC-STATE-049～051 |

### 3.4 横向cut

CUT-CAS/ROOT/DRAFT/RESULT/SOURCE/CAPACITY/CLEANUP/ERROR/CONFIG/BOUNDARY/AT/DESKTOP/DIAGNOSTIC/EVIDENCE分别进入CONC14、错误15、CFG12、边界/AT/host/report cases。03全部protocol/flow与状态源保持同名；只读query无业务事务，CAS失败视为客户端原子补丁失败，不模拟owner数据库rollback。

## 8. 回填草稿

正式05 §3回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

解析源确认43protocol、17state全部对应；所有模块有planned源路径。 本地设计gate pass_with_upstream_blockers；进入Step4，先读本产物/台账与对应SOP。
