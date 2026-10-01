# L5-chat 02 · Step 12 详细设计承接清单

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：把概要设计已经收稳的主要组成部分、对象、接口、处理流、状态机和配置影响显式交给 `03-详细设计.md`，并规定主语变更必须回退本概要设计。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 12；`standards/document/概要设计书写规范.md` §4.12。
> 上游输入：Step 4～11 全部中间产物、`projects/L5-chat/01-架构设计.md`、`projects/L5-chat/00-需求文档.md`。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 汇总稳定主语 | 主要部分、对象、接口、流、状态、配置影响 | `done` | 每项均有前序来源 |
| 定义 03 展开方向 | 字段、协议、函数、事务、错误、持久化、测试切口 | `done` | 不新增概要主语 |
| 定义回退规则 | 主语变更、owner/SDK contract 变化、边界冲突 | `done` | 详细设计不得暗改 |
| 风险/待确认隔离 | 未闭合项不写成稳定承接 | `done` | blocker 继续保留 |
| 回填、自检和门禁 | §12 草稿 | `done` | 完成后 `pass` |

## 2. SOP 问题回答

### 2.1 哪些代码主体框架已由概要设计收稳？

`ClientApplicationShell`、`RouteContextCoordinator`、`PageViewModelAssembler`、`CollaborationSurfaceCoordinator`、`UserIntentCoordinator`、`CommandResultGate`、`SdkQueryAdapter`、`SdkCommandAdapter`、`SdkChangeAdapter`、`SdkReferenceAdapter`、`ChangeReducer`、`ResumeCoordinator`、`RecoveryCoordinator`、`SafeMaterialComposer`、`ProvenanceMapper`、`FreshnessInterpreter`、`PreviewBoundary`、`ClientStateStore`、`LocalProjectionRepository`、`DraftStore`、`CacheEvictionCoordinator`、`PlatformCapabilityAdapter`、`AccessibilitySemanticAdapter`、`DiagnosticHandoffAdapter` 已成为概要层稳定主语。它们是代码主体骨架，不代表目录、文件、框架包或已实现事实。

### 2.2 哪些对象、接口、处理流和状态机已成为 03 输入？

对象输入包括 Route/Access/Selection/Turn presentation/Conversation surface、Draft/Attempt/Result gate/Feedback、Continuity/Resume/Acceptance/Recovery、Platform/Accessibility/Announcement、SafeMaterial/OwnerReference/Provenance/Freshness/Preview、LocalProjection/CacheLifecycle/PersistenceGuard。接口输入包括 Query、Command、Inbound Change/Result/Resume、低敏 Outbound Handoff 和 Operations Job 类别。处理流输入包括安全读取、普通发送、治理意图、formal change、receipt/result、resume/requery、unknown probe、Artifact preview、重启恢复、persist 和 eviction。状态输入包括 command result、access/disclosure、freshness、continuity、draft、local projection、platform capability 轴及其允许/禁止迁移。

### 2.3 详细设计应继续展开哪些内容？

03 应继续定义：

- shared core、shell、adapter、port、reducer 和 view model 的实际类型/模块边界（不得改变概要业务主语）。
- 关键对象完整字段、序列化/反序列化、类型转换、不可变/可变边界和生命周期。
- SDK adapter 的正式方法映射、ActorContext/CommandMetadata/IdempotencyKey/EventEnvelope/Resume/Result 等协议契约。
- `ChangeReducer`、`CommandResultGate`、`VisibilityGuard`、`PersistenceSafetyGuard` 的函数签名、守卫、幂等和错误映射。
- Query/Command/Event/Job 的事务/本地状态更新顺序、分页/cursor/resume、重试/探测/冲突和并发处理。
- cache/draft/recovery 的持久化格式、清理顺序、版本迁移、跨窗口/端隔离和平台适配。
- 可访问性、通知、深链、文件选择、redaction、低敏诊断、fake adapter 和测试切口。

### 2.4 发现主语需要变更时怎么办？

如果 03 发现需要新增、删除、合并或重命名主要组成部分、关键对象、正式接口、关键处理流、状态轴或配置边界，必须先暂停该 03 分支，回退 `02` 对应 Step（通常 Step 5～11）更新中间产物和正式概要设计；不能在 03 中通过别名、包装类型、隐式适配或局部文字偷偷改变主语。只有字段、内部 helper、协议细节、错误映射和实现结构可以在 03 内继续收敛。

## 3. 当前文档问题诊断

| 旧材料问题 | 影响 | 本步修正 |
|---|---|---|
| 旧 03 以不同对象名重新定义 Chat thread/reply/member/artifact | 形成概要/详细双真相和 owner shadow model | 建立稳定主语表，03 只能展开同名对象或回退 02。 |
| 旧 03 直接写 HTTP/WebSocket/SSE contract | 绑定未确认 transport，越过 SDK | 03 只在上游 exact surface 闭合后补协议；本概要只保留能力级接口。 |
| 旧 03 把目录/包名当结构边界 | 实现路径反向改变业务边界 | 目录/包名只能作为 03/07 实施材料，不能改主要组成部分。 |
| 旧 03 用 fake/fixture 作为集成事实 | 伪造 readiness/证据 | fake 只能用于本地映射测试切口，真实集成/测试/验收另行证明。 |

## 4. 详细设计承接清单

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 7 个主要组成部分及其职责边界 | 组件/模块实际组织、依赖注入和调用边界；不能把 owner truth 吸收进来。 |
| `ClientApplicationShell`、`RouteContextCoordinator`、页面/路由族 | 路由/深链/生命周期实现、页面 view model 装配和平台差异；不能把 route 当 owner scope。 |
| `ConversationSurfaceViewModel`、`TurnPresentationModel`、`SelectionState` | safe view mapping、分页/线程、焦点、渲染 selector 和性能切口；不能复制 Turn truth。 |
| `DraftState`、`CommandAttemptState`、`CommandResultGate`、`IntentFeedbackViewModel` | 完整字段、幂等、receipt/result mapping、错误/重试/探测、reducer action；不能 ACK=confirmed。 |
| `AccessPosture`、`VisibilityGuard`、`RouteContext` | ActorContext/visibility mapping、fail-closed、撤销/登出/过期清理；不能本地授予权限。 |
| `ContinuityState`、`ResumeContext`、`ChangeAcceptanceRecord`、`RecoveryViewModel` | event envelope、cursor/resume、gap/requery、去重/乱序、并发恢复；不能订内部 bus。 |
| `PlatformCapabilityState`、`AccessibilityState`、`StatusAnnouncement` | Tauri/Web/Mobile adapter、AT semantics、通知/返回/文件/存储能力和等价路径；不能改变业务状态。 |
| `SafeMaterialSnapshot`、`OwnerReference`、`ProvenanceMetadata`、`FreshnessMarker`、`PreviewReference` | owner/SDK safe surface 映射、redaction、preview、revision/freshness、局部缓存；不能持有 raw body。 |
| `LocalProjectionEntry`、`CacheLifecycleRecord`、`PersistenceSafetyGuard` | 存储格式、版本迁移、clear/evict 原子性、留存策略、跨端/窗口隔离；不能延长授权。 |
| Command API：`SubmitConversationIntent`、`SubmitGovernanceIntent` | 正式 SDK method/DTO、ActorContext/Metadata/Idempotency、错误/receipt/result 协议；不能在 Chat 执行 owner command。 |
| Query API：入口、surface、safe material、preview、capability、probe、resume、local projection | query mapping、分页、缓存/刷新、ProjectionNotReady/visibility fallback；不能用空结果推断不存在。 |
| Inbound Event Consumer：formal change、receipt/result、resume、visibility、material revision、shell lifecycle、eviction | envelope/schema、event identity、幂等 reducer、source/revision、失败/重试；不能写 broker/topic/offset 直连。 |
| Outbound Event：低敏 `ClientDiagnosticHandoffRequested` | allowlist/redaction/sink adapter；不能生成 owner audit/evidence/report。 |
| Operations Job：resume/requery/probe/refresh/restart/persist/evict | job lifecycle、并发、失败恢复、配置注入；不能执行业务副作用或把 job 完成当 owner truth。 |
| Command result 状态轴 | 类型/守卫/迁移实现和测试；confirmed 仍由正式 authority 门控。 |
| Access/Disclosure/Freshness/Continuity/Draft/LocalProjection/Platform 状态轴 | 状态实现、持久化/清理/跨端映射和错误姿态；不能压成单一 status。 |
| 配置影响轮廓及禁止配置化边界 | RuntimeConfig/Loader/Validator/AdapterConfig/JobConfig/ConfigError 和注入；不能改变硬边界。 |

## 5. 详细设计展开顺序建议（不构成实施计划）

1. 先锁定 SDK/owner formal surface 和安全类型映射，再定义 adapter/port 类型。
2. 再定义 Chat-local 对象、状态轴、reducer 和 view model 的完整字段/函数。
3. 再展开 Query/Command/Event/Job 的协议、事务、幂等、恢复和清理实现。
4. 再展开平台/可访问性/缓存/诊断配置注入与错误边界。
5. 最后建立测试切口、fake/fixture 与真实集成证据边界；不得把测试产物反向当设计事实。

该顺序只是详细设计的阅读/展开依赖，不是 `07-实施计划.md` 的 commit boundary、排期或实现授权。

## 6. 回退规则

如果详细设计发现上述主语需要变更，说明概要设计还没有真正收稳，应先回到概要设计修正，而不是在详细设计中暗改。以下情况必须回退 02：

- 新增或删除主要组成部分，或改变其职责/非职责。
- 将 Chat-local 对象升级为 owner truth，或将 owner ref/safe view 变成 Chat entity。
- 新增/删除/重分类正式 Command、Query、Event Consumer、Outbound Event 或 Operations Job。
- 改变 confirmed/unknown、fresh/gap、visibility/cleanup 等状态语义或允许/禁止迁移。
- 允许平台、feature flag、配置或缓存绕过 SDK-only、fail-closed、redaction、结果门控、unknown 不重放或清理边界。
- 引入 Chat 直接连接 owner/bus/数据库、Runtime/Tools/Bridges/Observability backend 的路径。

以下内容通常不必回退 02，除非改变了概要主语或边界：字段细节、协议字段、函数参数实现、错误码、retry/backoff 参数、序列化、数据库/文件格式、平台插件细节、测试用例和证据脚本。

## 7. 回填草稿（正式 §12）

> 校准来源：本文件 `§4 详细设计承接清单`、`§6 回退规则`。

详细设计必须承接本概要设计已经收稳的 7 个主要组成部分、关键对象、Command/Query/Event/Operations 接口类别、关键处理流、客户端多轴状态和配置影响边界。03 可以继续定义完整字段、协议/事件 envelope、函数/trait、事务、错误/幂等、分页/cursor/resume、缓存/清理、平台适配、可访问性、诊断和测试切口，但不能在 03 中新增或暗改概要主语。

如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，应先回到概要设计修正，而不是在详细设计中暗改。

## 8. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| SDK/owner exact type、method、envelope 和 result authority | 03 adapter/protocol/状态实现 | 03 开始前必须核对；未闭合则对应部分 blocked。 |
| 本地 persistence/平台 adapter 的正式能力 | 03/04 storage/shell 细节 | 只承接 port 和安全边界，不私造能力。 |
| 诊断 handoff 与证据边界 | 03 adapter、05/06 证据 | 低敏 optional；不生成 Observability truth。 |

## 9. 自检与门禁

### 9.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否只写前序已收稳的主语？ | 是；全部回指 Step 4～11。 |
| 是否给出详细设计继续展开的具体方向？ | 是；字段、协议、函数、事务、错误、持久化、平台、测试均列明。 |
| 是否明确主语变更回退规则？ | 是。 |
| 是否把待确认项写进稳定承接？ | 否；exact surface 和 platform/storage/diagnostic contracts 单列。 |
| 是否写实施任务、排期或测试结果？ | 否。 |
| 是否保留 owner/SDK/安全边界？ | 是。 |

### 9.2 进入下一步条件

- 03 的稳定输入、继续展开方向和回退规则已明确。
- 没有新增未讨论的对象、接口、流程、状态或配置结论。
- 详细设计可以继续下沉，但不得暗改概要主语。

### 9.3 门禁结论

`gate_status = pass`。Step 12 已完成，下一动作是创建并执行 `02_hld_step_13_risks_open_questions.md`；Step 13 将区分概要设计风险与仍待确认的问题，保留 inherited blocker，不将其润色为 readiness。

## 2026-10-01 当前逐章复核

计划/输入：Step12 SOP与规范§4.12、当前Step4～11以及既有§12。SOP回答：七单元/独立对象/Chat-local接口/多轴状态是稳定骨架；SDK/owner DTO、正式projection/provider/绑定和质量authority仍不稳定，不作为已收稳可用合同。旧03进度历史，不在本轮修订或继续。

诊断：旧handoff遗漏新增页面/流程/目录/context以及planned验证证据边界。以下表作为当前回填草稿：

| 稳定输入 | 03继续展开 |
|---|---|
| 项目列表/详情五标签；ProjectContextCoordinator/ProjectDetailViewModel/ProjectNavigationState | 定义路由参数及概览/进度/关联群聊/工作项/证据tab组件、局部store/selector、返回/viewport恢复字段和NavigateProjectContext签名；Work/关系/目标访问SDK映射未确认blocked |
| 整体→阶段→节点；ProcessDrilldownCoordinator/ProcessFlowViewModel/ProcessNodeDetailViewModel/ReadOnlyProcessRenderer | 定义授权拓扑/状态/节点关联adapter转换、viewer入参/事件映射、图与等价列表、版本兼容/父图失效reducer及planned测试切口；CHAT-UP008未闭合不得补BPMN XML或推join |
| 项目↔群聊；ProjectConversationLinkViewModel/LoadProjectConversationLinks | 定义正式关系读取/版本/解绑撤销/目标access mapping、安全返回ref及相关store清理；CHAT-UP009待owner，群聊成员不同不得继承项目/其他群权限 |
| 公司目录；DirectoryCoordinator/CompanyDirectoryViewModel/LoadCompanyDirectory/LoadMemberContext/UpdateDirectorySearch | 定义正式provider覆盖/分页/搜索/人员详情安全adapter、局部search/page请求代次、各成员集合section/DM能力mapping；未确认provider和人类/AI覆盖blocked |
| ClientConsumptionContext与source-local reducer/recovery | 完整actor/scope/project/target/source/请求代次比较规则、取消与迟到丢弃、source-local版本/幂等/游标、撤销优先及清理失败姿态；代次不替代SDK IdempotencyKey，不提供跨source事务 |
| optimistic与正式confirmed/failed/unknown分立 | 本地占位→正式结果替换/草稿恢复/unknown探测函数与事件reducer；普通receipt/ACK不得确认，未知副作用不自动重发；SDK正式幂等/probe未确认blocked |
| 新增§8.15～33处理流、§9局部状态与§10边界 | 细化函数签名/错误/guard/state更新顺序、diagram/list焦点/公告、revoke与query竞态；测试切口为planned，不填写实际run/report/verdict |
| 新增§11配置影响与禁止配置化 | ConfigLoader/Validator/AdapterConfig/JobConfig及viewer/目录/恢复注入；核心语义只读验证后的profile，04再给字段/默认/覆盖；不改Process/关系/目录来源与结果门控 |

复杂度用承接表无需图。验证切口回指当前§8/§10，与代码/真SDK/owner集成证据分开；引用工具/commit/test材料只为展示，非本项目测试事实。回填正式§12原位；自检无新主语、无排期/实施授权。主语变化须回退对应02 Step。Step12 done gate pass，进入Step13；无实现/测试/提交。
