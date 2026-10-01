# L5-chat 03 · Step 16 测试切口与最小验证

## 1. Step 状态

> done；pass_with_upstream_blockers；2026-10-01。SOP Step16、书写规范5.15；回填正式03 §15。
> CUT-*只是设计切口标识，不是05正式TC/06EV编号；所有表均planned，未创建测试代码/执行/结果。

### 1.1 Step内计划

| 批次 | 范围 | 状态 |
|---|---|---|
| 16-A | 十模块与native host切口 | done |
| 16-B | 全43协议逐正向/异常 | done |
| 16-C | 17状态主体/12enum合法与非法 | done |
| 16-D | 一致性/幂等/安全、脚本输入输出/证据边界 | done |

复杂度按module/protocol/state/consistency四族；具体runner/TC/优先级/fixture/evidence移交05/06/07。本步使用表格即可精确回指全部flow，不额外画重复调用图。

## 2. 本步输入

Step5～15全部契约；Step4 planned测试路径；正式00真实AC-FR/AC-NFR与NFR；Governance Step16模块/逐接口/逐状态/并发/脚本颗粒度。按照书写规范的artifact root固定artifacts/test/<run_id>，report root固定reports/。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1. 每模块最小单测 | §7.1逐模块factory/guard/coordinator/adapter/React/host断言；无owner执行测试冒充客户端验证。 |
| 2. 每接口正反向 | §7.2逐43项列正向和异常；真实SDK未bound时正向仅隔离合同fixture，负向必须dependency_unbound/零effect。 |
| 3. 状态合法/非法 | §7.3逐17主体覆盖Step10所有矩阵行和非法表；同一12canonical enum，不创建口语别名。 |
| 4. 一致性/幂等/并发 | §7.4用deterministic deferred port回包控制顺序，断言CAS/调用次数/水位/遮蔽先于stop/delete。 |
| 5. 05细节 | runner、具体TC数据与优先级/覆盖率/环境、OS兼容矩阵/数值质量门禁；06定义正式EV，07定义实施boundary和实测证据记录。 |

## 4. 当前文档问题诊断

| 位置 | 问题 | 收口 |
|---|---|---|
| Step8/9逐卡切口 | 分散难确保43覆盖 | §7.2每协议唯一CUT-P索引 |
| Step10 page共享enum | 只测enum容易漏某page行为 | §7.3五page独立主体覆盖 |
| Step15 metrics blocked | 自动指标“测试成功”可能虚假 | 仅测无旁路/disabled/allowlist，正向sink需合同 |
| Step4测试源 | 缺scripts/gate/report约定 | §7.5定义planned命令合同并同步Step4职责，不创建脚本 |
| CHAT-BASE001 | 未定义AC-NFR008～024 | 引用真实AC-NFR001～007及NFR001～024，不补造验收号 |

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 逐接口验证 | dispersed tips | 43行成对正反向 | 防query/job遗漏 |
| state验证 | 易只happy path | 17主体矩阵全行+非法不变量 | enum共享不等行为相同 |
| fake效果 | 易混成真实接入 | 隔离fixture不证明生产binding | 保持证据真实性 |
| artifact | 可能手写空report | future scripts只从真实run输入生成 | 无run就无报告/ready |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| typed port failure injection + 组件/host安全切口 | 竞态可重复，适配模块边界 | 真实接入另需integration gate | 采用planned |
| 原型点击/截图即验收 | 直观 | 不证明owner/SDK/安全/并发 | 不采用 |
| 只snapshot页面 | 容易做 | 无法验证single dispatch/撤销水位 | 仅辅助，不替代行为测试 |
| 当前执行测试生成报告 | 可给结果 | 当前只有设计，没有实施仓 | 不执行，不伪造 |

## 7. 结构化中间产物

### 7.1 模块与planned测试源

| 模块 | 对应planned测试源 | 最小验证内容 |
|---|---|---|
| app | tests/sdk_binding_tests.ts；presentation_accessibility_tests.tsx | 安全初始化/绑定缺失、StrictMode不double submit、dispose晚到不写 |
| navigation | tests/navigation_boundary_tests.ts | group/channel/dm/thread/parent、deep link、current actor/fence/slot、hidden、返回重验 |
| collaboration | tests/presentation_accessibility_tests.tsx | Turn分派、safe材料、分页、组件props与callback；无直接SDK IO |
| collaboration项目/流程 | tests/project_process_boundary_tests.tsx | 五tab、整体→阶段→节点、BPMN fork/branch/join、独立Gate、safe图/list/AT一致 |
| collaboration关系/目录 | tests/directory_relationship_boundary_tests.tsx | 多群/不同成员、binding owner缺口、逐target access、目录coverage/search/lineage |
| intents | tests/intent_result_tests.ts | Draft revision、single dispatch、ordinary ACK、unknown probe、formal gate、显式retry |
| continuity | tests/continuity_recovery_tests.ts | formalqualification/source顺序、duplicate/gap/resume、跨端刷新/离线、不自动重发 |
| materials | tests/persistence_boundary_tests.ts；presentation_accessibility_tests.tsx | provenance/freshness/visibility、unsafe/unsupported、preview ref，不猜body/URL |
| local_state | tests/persistence_boundary_tests.ts | root CAS/slot检查、draft版配对、entry版/partition、save-after-revoke、delete失败 |
| sdk | tests/sdk_binding_tests.ts | public export/contract资格、blocked adapter零IO、effect_unknown/error mapper、fixture隔离 |
| platform | tests/presentation_accessibility_tests.tsx | 键盘、IME、焦点、状态公告、contrast/reduced motion、安全等价列表 |
| config | tests/sdk_binding_tests.ts | strict keys/literals/required limits、unknown/secret/profile rejected |
| native_host | src-tauri/tests/platform_boundary_tests.rs | origin/window/kind allowlist、未知权限fail-closed、无业务SDK/Tools IO |

### 7.2 全43协议成对测试切口

每行对应Step8/9同名独立卡；所有异步positive都断言originalcontext/current slot/root版一致，negative断言零不安全写入/显示/second effect。允许模拟正式authority的**隔离测试scope**，禁止fake材料确认真实attempt或成为正式证据。

| 切口 | 对应协议/flow | 正向 | 异常/安全 | 建议类型 |
|---|---|---|---|---|
| CUT-P-01 | SubmitConversationIntent | 冻结当前draft→预留→单dispatch→formal confirmed，只清同revision | 双击/IME/ACK/断线unknown，新稿不被旧确认清 | facade/port/组件合同 |
| CUT-P-02 | SubmitGovernanceIntent | formal Gate/action capability→single dispatch→正式结果反馈 | 点击/transport不确认，Gate capability撤销/unknown不重发 | facade/port/组件合同 |
| CUT-P-03 | RequestSafePreview | 正式无effect安全preview query | 有副作用能力/未bound/hidden禁止open | facade/port/组件合同 |
| CUT-P-04 | AcknowledgeLocalRecoveryAction | current source下允许resume/requery/probe/clear | 非法action或unknown resend拒绝 | facade/port/组件合同 |
| CUT-P-05 | ResolveEntryAccess | group/channel/dm/thread与项目/目录入口正式资格解析 | 深链伪actor/无parent/旧epoch/hidden不泄露 | facade/port/组件合同 |
| CUT-P-06 | LoadConversationSurface | qualifiedsafe surface一次current CAS | 切换会话后late response不覆写，hidden清refs | facade/port/组件合同 |
| CUT-P-07 | LoadTurnPage | SDK排序/page lineage正向，Turn类型安全分派 | 未知category/错cursor lineage/旧页/无限分页拒绝 | facade/port/组件合同 |
| CUT-P-08 | LoadOwnerSummary | source provenance/freshness独立保持 | raw body/跨owner版本/无visibility拒绝 | facade/port/组件合同 |
| CUT-P-09 | LoadArtifactPreview | safe ref→正式preview descriptor | 过期/撤销/unsupported清openRef，不拼URL | facade/port/组件合同 |
| CUT-P-10 | LoadIntentCapability | 当前actor/scope/intent/Gate正式能力 | 缓存/host available不授予提交 | facade/port/组件合同 |
| CUT-P-11 | ProbeCommandAttempt | matched formal probe收敛unknown | not_found无no-effect仍unknown，错association拒绝 | facade/port/组件合同 |
| CUT-P-12 | LoadResumeContext | 当前单source恢复候选 | 跨source/cursor字符串排序/旧request拒绝 | facade/port/组件合同 |
| CUT-P-13 | LoadLocalProjection | 同partition load含entry版/null | 错partition不泄露存在性，cache不授权 | facade/port/组件合同 |
| CUT-P-14 | LoadDraft | 当前context内存稿/root版 | 项目/目录伪Conversation/跨scope稿拒绝 | facade/port/组件合同 |
| CUT-P-15 | ProbePlatformCapability | 四host能力各自probe姿态 | 假origin/旧window/无合同unknown，不授予业务权 | facade/port/组件合同 |
| CUT-P-16 | LoadAccessibilityContext | safe page派生region/focus/announcement | 隐藏label/count/边不能出现在AT，失效焦点转安全区 | facade/port/组件合同 |
| CUT-P-17 | LoadProjectList | 正式Work项目safe页与page info | 空页不推项目不存在；旧搜索/页拒绝 | facade/port/组件合同 |
| CUT-P-18 | LoadProjectDetail | 五tab、各sourcesection与返回语境 | 顶层progress不存在，partial不混成全owner fresh | facade/port/组件合同 |
| CUT-P-19 | LoadProjectProcessFlow | Process整体safe topology/版本/并行gateway | 从WorkItem/log/prototype补图拒绝，hidden边裁剪 | facade/port/组件合同 |
| CUT-P-20 | LoadStageProcessFlow | matchedparent进入独立阶段流程 | 父版本变化/阶段迟到清旧child，无伪汇聚 | facade/port/组件合同 |
| CUT-P-21 | LoadProcessNodeDetail | 当前safe节点的工作/运行/工具/提交/测试/证据独立section | 旧node返回拒绝；safe摘要不等验收evidence | facade/port/组件合同 |
| CUT-P-22 | LoadProjectConversationLinks | 正式关系和每个target独立access | 解除/撤销/不同群成员不串权；本地不建binding | facade/port/组件合同 |
| CUT-P-23 | LoadCompanyDirectory | 正式provider人类/AI覆盖/搜索/分页 | 覆盖未知/隐藏人数/跨querypage不合并，Identity不伪全目录 | facade/port/组件合同 |
| CUT-P-24 | LoadMemberContext | Identity/ProjectMember/Participant/presence独立 | 目录可见不授予DM/项目，Runtime summary不当presence | facade/port/组件合同 |
| CUT-P-25 | ConsumeFormalChange | source-qualified change一次CAS更新slice/水位 | duplicate无二次apply；gap/乱序/oldslot无fresh | facade/port/组件合同 |
| CUT-P-26 | ConsumeCommandReceiptOrResult | formalauthority/correlation后result gate | 普通receipt/WS/AG-UI ACK/fake不确认真实attempt | facade/port/组件合同 |
| CUT-P-27 | ConsumeResumeResult | current source/recovery+completecoverage才fresh | partial/错recovery/旧slots不fresh | facade/port/组件合同 |
| CUT-P-28 | ConsumeVisibilityChange | 当前scope/source正式revoke先隐藏失效 | closed node仍被遮蔽；stop/delete失败不回滚 | facade/port/组件合同 |
| CUT-P-29 | ConsumeMaterialRevisionChange | 仅matchedsource材料stale/parent失效 | 跨source不覆盖，旧revision不复活graph | facade/port/组件合同 |
| CUT-P-30 | ConsumeShellLifecycle | 可信host offline/background/closing技术消费 | 窗口ACK/closing不取消owner或确认业务 | facade/port/组件合同 |
| CUT-P-31 | ConsumeEvictionTrigger | qualifiedclearreason→先hide再repo delete | 非法触发/冲突delete不能cleared | facade/port/组件合同 |
| CUT-P-32 | ClientDiagnosticHandoffRequested | 显式current低敏六字段，合格sinkreceipt | disabled零IO/额外secret字段拒绝/unknown不重送 | facade/port/组件合同 |
| CUT-P-33 | ClientSupportContextRequested | 显式支持分类/有限reason构造 | raw logs/query/actorref/截图不能加入payload | facade/port/组件合同 |
| CUT-P-34 | ResumeChangeContext | 每source single-flight resume | 双resume/旧recovery/断线ACK不fresh | facade/port/组件合同 |
| CUT-P-35 | RequeryAfterGap | 新qualifiedsnapshot覆盖相应source | 缺coverage不能清gap/吞变更 | facade/port/组件合同 |
| CUT-P-36 | ResolveUnknownAttempt | 只formalprobe→合法结果轴 | not_found/timeout不自动dispatch | facade/port/组件合同 |
| CUT-P-37 | RefreshStaleMaterial | newcurrent source材料/marker | revoked旧ref不refresh恢复权限 | facade/port/组件合同 |
| CUT-P-38 | RestoreAfterShellRestart | safe locator新epoch重新入口/正式read | 旧confirmed/access/handle不恢复，memory无durable承诺 | facade/port/组件合同 |
| CUT-P-39 | PersistLocalProjection | 当前fence/partition/entry版memory保存 | pending save-after-revoke拒绝，正文/secret不disk | facade/port/组件合同 |
| CUT-P-40 | EvictLocalMaterial | deleted/already_absent→memorycleared | storage/conflict失败restricted仍隐藏 | facade/port/组件合同 |
| CUT-P-41 | EmitDiagnosticHandoff | 显式approved input按mode交付 | 缺sinkblocked/默认disabled/unknown no resend | facade/port/组件合同 |
| CUT-P-42 | NavigateProjectContext | 五tab和safe stage/node局部选择 | 旧parent/hiddennode/错误project拒绝，不能绑定群聊 | facade/port/组件合同 |
| CUT-P-43 | UpdateDirectorySearch | 新querygeneration登记slot并清旧page | rapidsearch late results/旧cursor不能覆写 | facade/port/组件合同 |

### 7.3 17主体/12enum状态测试

每行不是只测一条示例：实现后05须展开对应Step10矩阵**全部合法行、guard缺失和全部非法表**；以下为最小锚点。非法不变量：返回指定ChatError、原值不变、无SDK effect、无不合格patch/水位/正文泄漏。

| 切口 | 主体/canonical enum | 合法锚点 | 非法/边界锚点 |
|---|---|---|---|
| CUT-S-01 | RouteContext / RoutePhase | unresolved→resolved；expired新generation重验 | 缓存/deeplink不能直接resolved且authorized |
| CUT-S-02 | AccessPosture / AccessAvailability | 正式可读与安全收紧分别处理 | hidden不能被technical unavailable恢复 |
| CUT-S-03 | ClientConsumptionContext / ConsumptionContextPosture | active→invalidated→cleared；新slot另建 | 旧slot/mismatchedactor/source拒绝 |
| CUT-S-04 | SelectionState / SelectionPhase | empty→selected；stale/clear后新current选择 | 跨context或隐藏target不选中 |
| CUT-S-05 | ProjectNavigationState / SelectionPhase | safeproject五tab/整体→stage→node选择 | 旧parent/不获准node不能进入 |
| CUT-S-06 | ProjectDetailViewModel / PageLoadPosture | loading→ready/partial，变化→stale，revoke→blocked | 混合source不可一次fresh，failLoad不覆盖新generation |
| CUT-S-07 | ProcessFlowViewModel / PageLoadPosture | 正式拓扑loading→ready/partial；父变化stale | 无source/不兼容版本不ready |
| CUT-S-08 | ProcessNodeDetailViewModel / PageLoadPosture | 当前node section loading→ready/partial | late node不覆写，hidden引用清理 |
| CUT-S-09 | ProjectConversationLinkViewModel / PageLoadPosture | 正式关系+target各access→ready/partial | 本地binding不ready，解除清目标 |
| CUT-S-10 | CompanyDirectoryViewModel / PageLoadPosture | newquery→loading→ready/partial | oldpage lineage不ready，不猜coverage |
| CUT-S-11 | DraftState / DraftPhase | editing→locally_valid→submitting；失败release后editing再验 | unknown/pending不能释放旧submitting用于重发 |
| CUT-S-12 | CommandAttemptState / CommandResultPosture | draft→submitted→pending/confirmed或unknown→probe | ACK不能confirmed，unknown无automatic_retry，terminal不反转 |
| CUT-S-13 | FreshnessMarker / FreshnessState | 正式sourcecoverage更新；过期/stale收紧 | cache/arrival/跨source成功不fresh |
| CUT-S-14 | SafeMaterialSnapshot / DisclosurePosture | 按正式visibility允许→收紧/cleared | 未知/撤销内容不展示，不可降级还保留title |
| CUT-S-15 | ContinuityState / ContinuityPhase | stale/gap→resuming→formalcoverage fresh | reconnecting或单event不清gap |
| CUT-S-16 | LocalProjectionEntry / LocalProjectionState | cached→restored/stale；evicting→confirmeddelete cleared | failed delete不cleared，restored不authorized/fresh |
| CUT-S-17 | PlatformCapabilityState / CapabilityAvailability | 每capability独立probe五态 | 无host proof不available，host可用不intent可用 |

### 7.4 一致性、幂等、错误、安全与证据

| 切口 | 契约 | 检查方法/断言 |
|---|---|---|
| CUT-CAS | Step11/13 CONC-01～14 | deferred ports制造双callback/旧回包/revoke竞争；winner最多一次dispatch，loser零effect |
| CUT-ROOT | ClientPatch/ConsumptionCheck | 同一CAS所有slot/fence/版检查，不允许部分成功；空checks不能导入材料 |
| CUT-DRAFT | Draft/Attempt | frozen payload不可变；旧confirm不清新revision；unknown不释放旧submitting去重 |
| CUT-RESULT | CommandResultGate | ordinary receipt/HTTP2xx/WS/AG-UI ACK拒绝；formalauthority/correlation正确才terminal |
| CUT-SOURCE | Continuity/Resume | opaque cursor不得排序；单sourcepatch/acceptedid/watermark同CAS；不同owner不原子 |
| CUT-CAPACITY | maxConsumedChanges/maxContexts/cache/graph | 边界值与超过上限；失效/裁剪不泄露hiddencount，去重容量不足需formal重取 |
| CUT-CLEANUP | evict/visibility/dispose | hide/invalidate先于stop/delete；失败restricted不清理成功；closednode撤销有效 |
| CUT-ERROR | 15ChatErrorCode | 每码触发、retry上限和safe输出；dependency_unavailable区别unbound，不原样透传stack |
| CUT-CONFIG | ClientConfig14字段 | 缺项/非整数/未知键/secret/false memoryOnly拒绝；fixture值非生产默认 |
| CUT-BOUNDARY | Step5依赖/Step7 ports | import与spy检查无UI业务IO/ownerprivate API/internalbus/Runtime推理/Tools执行/观测backend |
| CUT-AT | 图/list/keyboard/AT同safe topology | 相同安全节点/边/版本/焦点；hiddentitle/count不出ARIA/breadcrumb，撤销时焦点移安全region |
| CUT-DESKTOP | V1 shell与host能力 | 将来真实OS矩阵/键盘/窗口/重启/IPC验证；Web preview/fake不冒充Desktop资格 |
| CUT-DIAGNOSTIC | Step15六字段支持操作 | strict extra拒绝、disabled零IO、unknown无重送、无rawref/secret/日志包 |
| CUT-EVIDENCE | 真实run/paths/redaction | 原型/截图/safe commit或test摘要/fake case不是EV；无真实run不生成acceptance/readiness |

### 7.5 planned脚本合同

这些路径将进入未来实现仓，当前只追加Step4 planned职责；不创建源码，不安装runner，不执行。05/06/07须选择runner、machineartifact schema、suite/TC/EV映射并完成门禁后，脚本才可实现。

| 脚本 | 类型/参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|
| scripts/gates/run_ci_gate.sh | gate；--run-id --artifact-root --config-profile | 真实源码/validated config/已定义suite；artifact-root必须artifacts/test/<run_id> | 同root真实machine测试材料与执行状态 | 未bound集成suite显式blocked，不能fake pass；真实失败nonzero并保留失败材料 |
| scripts/reports/generate_reports.sh | report；--run-id --artifact-root --report-root | 同run machine材料，report-root固定reports/runs/<run_id> | 仅可审查summary/gate-results/阶段允许的evidence-index | 缺run/schema/path/EV输入nonzero；不得用模板补伪测试/验收结果 |
| scripts/checks/check_redaction.sh | check；--run-id --artifact-root --report-root | 同run材料和报告 | reports/runs/<run_id>/redaction-check.md真实检查结果 | secret/rawbody/unsafe路径失败；不输出命中的secret/raw片段 |
| 未来acceptance handoff | 由06/07另行定义 | 完整正式EV及真实run | reports/acceptance/允许的审阅材料 | 03不生成signoff/verdict/readiness，不补造 |

报告成熟度严格分离：脚本能力→最小index壳→完整EV明细→acceptance handoff；各级只能由07允许boundary激活，不能提前生成后级材料。当前全部planned/waiting；没有真实run-id、artifact、report、测试结果或验收结果。

### 7.6 最小闭环检查

| 覆盖 | 设计结果 |
|---|---|
| protocol→flow→正/异常切口 | 43/43逐名对应；未来05深化，不代表已执行 |
| state→合法/非法切口 | 17主体、12enum；五page独立 |
| module/native→planned测试路径 | Step4相同路径，新增scripts仍仅设计 |
| concurrency→可调度失败注入 | 14真实local竞争场景，无backend UoW模拟越权 |
| acceptance引用 | 真实00 AC-NFR001～007/NFR001～024/AC-FR011～014；BASE001仍open |
| artifact/报告 | run-scoped paths固定，不自造EV/TC/通过率或commit |
| SDK/host正向 | 未bound仍blocked；纯fixture不能满足真实integration |

## 8. 回填草稿

正式03 §15采用§7全部模块/43协议/17主体/一致性与脚本合同。05只细化用例与环境，06定义证据标准，07映射phase/boundary；三者尚未开始本轮设计。

## 9. 待确认事项

runner/OS矩阵/数值阈值、生产config、machineartifact与EV schema以及真实SDK/host/provider合同继续waiting/blocked。没有实测前不闭合任何integration或quality blocker。

## 10. 进入下一步条件

每43协议有正反向、17主体有合法/非法、十一实现责任与concurrency/error/security有最小切口，脚本输入/路径/失败与证据级别已明确。local设计gate通过，进入Step17承接预审。
